import os

from flask import Flask
from werkzeug.middleware.http_proxy import ProxyMiddleware
from oauth2 import add_token_to_uri


app = Flask(__name__)
app.secret_key = os.environ['FLASK_SECRET_KEY']


class FoursquareAPIProxy(ProxyMiddleware):
    def _add_token(self, environ):
        with app.request_context(environ):
            qs = '?' + environ['QUERY_STRING']
            environ['QUERY_STRING'] = add_token_to_uri(qs)[1:]
            return environ

    def __call__(self, environ, start_response):
        path = environ["PATH_INFO"]
        for prefix, opts in self.targets.items():
            if path.startswith(prefix):
                environ = self._add_token(environ)
                return super(FoursquareAPIProxy, self).__call__(
                    environ, start_response)

        return self.app(environ, start_response)
