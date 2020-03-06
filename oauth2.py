import os
from datetime import timedelta

from flask import Blueprint, redirect, request, session, url_for
from authlib.integrations.flask_client import OAuth, FlaskRemoteApp
from authlib.common.urls import add_params_to_uri


_oauth_token_cookie_key = 'foursquare_oauth_token'


def foursquare_compliance_fix(session):
    def _token_response(resp):
        token = resp.json()
        token['token_type'] = 'Bearer'
        resp.json = lambda: token
        return resp

    session.register_compliance_hook('access_token_response', _token_response)

    def _non_compliant_param_name(url, headers, data):
        access_token = session.token['access_token']
        api_version = os.environ['FOURSQUARE_API_VERSION']
        params = [('oauth_token', access_token), ('v', api_version)]
        url = add_params_to_uri(uri, params)
        return url, headers, data

    session.register_compliance_hook('protected_request', _non_compliant_param_name)


class Foursquare(FlaskRemoteApp):
    OAUTH_TYPE = '2.0'
    OAUTH_NAME = 'foursquare'
    OAUTH_CONFIG = {
        'api_base_url': 'https://api.foursquare.com/v2/',
        'access_token_url': 'https://foursquare.com/oauth2/access_token',
        'authorize_url': 'https://foursquare.com/oauth2/authenticate',
        'fetch_token': lambda: request.cookies.get(_oauth_token_cookie_key),
        'compliance_fix': foursquare_compliance_fix,
    }

    @classmethod
    def register_to(cls, oauth):
       return oauth.register(cls.OAUTH_NAME, client_cls=cls, **cls.OAUTH_CONFIG)


oauth = OAuth()
foursquare = Foursquare.register_to(oauth)
bp = Blueprint('oauth2', __name__)


@bp.route('/auth')
def auth():
    token = foursquare.authorize_access_token()
    response = redirect(session.get('login_referrer', '/'))
    response.set_cookie(
        _oauth_token_cookie_key, token['access_token'],
        max_age=timedelta(days=31).total_seconds())
    return response


@bp.route('/login')
def login():
    session['login_referrer'] = request.referrer
    redirect_uri = url_for('.auth', _external=True)
    return foursquare.authorize_redirect(redirect_uri)
