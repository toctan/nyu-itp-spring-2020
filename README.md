# Marsbot

## Running Locally
First sync heroku config vars to local `.env` file:
```
heroku config -s > .env
```
Then run:
```
heroku local
```


## Deploy!
First add heroku remote to your local git repo:
```
heroku git:remote -a [app name]
```
Then just push to the heroku remote:
```
git push heroku master
```
