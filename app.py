import os
from flask import Flask
from oauth2 import oauth, foursquare_bp, require_token
from api_proxy import FoursquareAPIProxy

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['FOURSQUARE_CLIENT_ID'] = os.environ['FOURSQUARE_CLIENT_ID']
app.config['FOURSQUARE_CLIENT_SECRET'] = os.environ['FOURSQUARE_CLIENT_SECRET']

app.register_blueprint(foursquare_bp, url_prefix='/')
oauth.init_app(app)


@app.before_request
@require_token
def before_request():
    pass


@app.route('/')
def home():
    return 'Hello World!'


app.wsgi_app = FoursquareAPIProxy(app.wsgi_app, {
    "/api/": {
        "target": oauth.foursquare.api_base_url,
        "remove_prefix": True,
    }
})

if __name__ == '__main__':
    app.run()
