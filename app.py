import os
from flask import Flask
from oauth2 import oauth, bp as oauth2_bp

app = Flask(
    __name__,
    static_folder='web/build',
    static_url_path='/',
)

app.config['SECRET_KEY'] = os.environ['FLASK_SECRET_KEY']
app.config['FOURSQUARE_CLIENT_ID'] = os.environ['FOURSQUARE_CLIENT_ID']
app.config['FOURSQUARE_CLIENT_SECRET'] = os.environ['FOURSQUARE_CLIENT_SECRET']

app.register_blueprint(oauth2_bp, url_prefix='/')
oauth.init_app(app)

# TODO: use WhiteNoise to serve static files
@app.errorhandler(404)
def home(e):
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run()
