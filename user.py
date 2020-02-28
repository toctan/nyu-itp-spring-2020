import os
import json

import redis
from authlib.oidc.core import UserInfo

r = redis.from_url(os.environ['REDIS_URL'])


class User(UserInfo):

    @classmethod
    def find(cls, id):
        key = '/user/{}'.format(id)
        data = r.get(key)
        return data and cls(json.loads(data))

    def save(self, token=None):
        self['token'] = token
        key = '/user/{}'.format(self.sub)
        return r.set(key, json.dumps(self))
