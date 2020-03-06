import os
from datetime import timedelta

from flask import redirect, request
from authlib.flask.client import OAuth
from authlib.common.urls import add_params_to_uri
from loginpass import create_flask_blueprint
from loginpass._core import OAuthBackend

oauth_token_cookie_key = 'foursquare_oauth_token'


def fetch_token():
    return request.cookies.get(oauth_token_cookie_key)


def handle_authorize(remote, token, user):
    response = redirect(request.args.get('next', '/'))
    response.set_cookie(
        oauth_token_cookie_key, token['access_token'],
        max_age=timedelta(days=31).total_seconds())
    return response


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
        pass



oauth = OAuth()
foursquare_bp = create_flask_blueprint(Foursquare, oauth, handle_authorize)
