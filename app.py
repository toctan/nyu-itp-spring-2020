import logging

import os
from flask import Flask, jsonify
from oauth2 import oauth, foursquare_bp, require_token


app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['FOURSQUARE_CLIENT_ID'] = os.environ['FOURSQUARE_CLIENT_ID']
app.config['FOURSQUARE_CLIENT_SECRET'] = os.environ['FOURSQUARE_CLIENT_SECRET']

app.register_blueprint(foursquare_bp, url_prefix='/')

oauth.init_app(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/checkins')
@require_token
def checkins():
    resp = oauth.foursquare.get('users/self/checkins')
    resp.raise_for_status()
    return jsonify(resp.json())



if __name__ == '__main__':
    app.run()
