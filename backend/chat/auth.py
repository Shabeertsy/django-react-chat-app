from rest_framework.authtoken.models import Token
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
import jwt
from django.conf import settings
from .models import Profile


	
@database_sync_to_async
def returnUser(token_string):
    try:
        decoded_token = jwt.decode(token_string, settings.SECRET_KEY, algorithms=['HS256'])
        user = Profile.objects.get(pk=decoded_token['user_id'])
    except Exception as e:
        print(e,'exception')
        user = AnonymousUser()
    return user

class TokenAuthMiddleWare:
	def __init__(self, app):
		self.app = app

	async def __call__(self, scope, receive, send):
		query_string = scope["query_string"]
		query_params = query_string.decode()
		query_dict = parse_qs(query_params)
		try:
			token = query_dict["token"][0]
		except:
			token=''
		user = await returnUser(token)
		scope["user"] = user
		return await self.app(scope, receive, send)
