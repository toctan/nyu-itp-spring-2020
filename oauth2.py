import os
from functools import wraps
from datetime import timedelta

from flask import session, redirect, url_for, request, g
from authlib.flask.client import OAuth
from authlib.common.urls import add_params_to_uri
from loginpass import create_flask_blueprint
from loginpass._core import OAuthBackend, map_profile_fields

from user import User

oauth_token_session_key = 'foursquare_oauth_token'
user_id_session_key = 'current_user_id'


def fetch_token():
    return session.get(oauth_token_session_key)


def handle_authorize(remote, token, user):
    user.save(token)
    session[user_id_session_key] = user.sub
    session[oauth_token_session_key] = token
    next = request.args.get('next', '/')
    response = redirect(next)
    max_age = timedelta(days=31).total_seconds()
    response.set_cookie(oauth_token_session_key, token['access_token'], max_age=max_age)
    return response


def require_login(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        g.user = User.find(session.get(user_id_session_key))
        if not g.user and not request.endpoint.startswith('loginpass'):
            return redirect(url_for('loginpass_foursquare.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def add_token_to_uri(uri, access_token):
    api_version = os.environ['FOURSQUARE_API_VERSION']
    params = [('oauth_token', access_token), ('v', api_version)]
    return add_params_to_uri(uri, params)


def foursquare_compliance_fix(session):
    def _token_response(resp):
        token = resp.json()
        token['token_type'] = 'Bearer'
        resp.json = lambda: token
        return resp

    session.register_compliance_hook('access_token_response', _token_response)

    def _non_compliant_param_name(url, headers, data):
        url = add_token_to_uri(url, session.token['access_token'])
        return url, headers, data

    session.register_compliance_hook('protected_request', _non_compliant_param_name)


class Foursquare(OAuthBackend):
    OAUTH_TYPE = '2.0'
    OAUTH_NAME = 'foursquare'
    OAUTH_CONFIG = {
        'api_base_url': 'https://api.foursquare.com/v2/',
        'access_token_url': 'https://foursquare.com/oauth2/access_token',
        'authorize_url': 'https://foursquare.com/oauth2/authenticate',
        'client_kwargs': {},
        'fetch_token': fetch_token,
        'compliance_fix': foursquare_compliance_fix,
    }

    def profile(self, **kwargs):
        resp = self.get('users/self', **kwargs)
        resp.raise_for_status()
        user = resp.json()['response']['user']
        return User(map_profile_fields(user, {
            'sub': 'id',
            'given_name': 'firstName',
            'family_name': 'lastName',
            'profile': 'canonicalUrl',
            'picture': 'photo',
            'email': lambda u: u['contact']['email'],
        }))


oauth = OAuth()
foursquare_bp = create_flask_blueprint(Foursquare, oauth, handle_authorize)
