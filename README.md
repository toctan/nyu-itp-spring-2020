# Marsbot Audio

## Running Locally
Configure required environment variables with [`.env`](https://devcenter.heroku.com/articles/config-vars):
```
cp .env.template .env
vim .env
```
Install dependencies:
```
pip install -r requirements.txt
yarn run heroku-prebuild
```
Then run:
```
heroku local -f Procfile.development
```
Wait, then a browser tab should open automatically, happy coding!

## Deploy!
First add heroku remote to your local git repo:
```
heroku git:remote -a [app name]
```
Then just push to the heroku remote:
```
git push heroku master
```
