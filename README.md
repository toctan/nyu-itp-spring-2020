# Marsbot

## Running Locally
First sync heroku config vars to local `.env` file:
```
heroku config -s > .env
```
Install dependencies:
```
pip install -r requirements.txt
cd web && yarn install
```
Then run:
```
heroku local -f Procfile.development
```
A browser tab should open automatically, happy coding!

## Deploy!
First add heroku remote to your local git repo:
```
heroku git:remote -a [app name]
```
Then just push to the heroku remote:
```
git push heroku master
```
