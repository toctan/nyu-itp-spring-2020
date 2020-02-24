from functools import wraps

from flask import session, redirect, url_for, request
from authlib.flask.client import RemoteApp, OAuth
from authlib.common.urls import add_params_to_uri
from loginpass import create_flask_blueprint
from loginpass._core import OAuthBackend, UserInfo, map_profile_fields


def handle_authorize(remote, token, user_info):
    if token:
        save_token(token)
    next = request.form.get('next', url_for('checkins'))
    return redirect(next)


oauth_token_session_key = 'foursquare_oauth_token'

def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if oauth_token_session_key not in session:
            return redirect(url_for('loginpass_foursquare.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


def fetch_token():
    return session[oauth_token_session_key]


def save_token(token):
    session[oauth_token_session_key] = token
    print('Token Saved: ', session[oauth_token_session_key])


def foursquare_compliance_fix(session):
    def _token_response(resp):
        token = resp.json()
        token['token_type'] = 'Bearer'
        resp.json = lambda: token
        return resp

    session.register_compliance_hook('access_token_response', _token_response)

    def _non_compliant_param_name(url, headers, data):
        access_token = session.token.get('access_token')
        params = [('oauth_token', access_token), ('v', '20200223')]
        url = add_params_to_uri(url, params)
        return url, headers, data

    session.register_compliance_hook('protected_request', _non_compliant_param_name)


class Foursquare(object):
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
        return UserInfo(map_profile_fields(user, {
            'sub': 'id',
            'given_name': 'firstName',
            'family_name': 'lastName',
            'email': lambda u: u['contact']['email'],
            'gender': 'gender',
        }))


oauth = OAuth()
foursquare_bp = create_flask_blueprint(Foursquare, oauth, handle_authorize)
