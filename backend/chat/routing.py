from django.urls import re_path

from . import consumers 

websocket_urlpatterns=[
    re_path(r'chat/(?P<sender_id>\w+)/$', consumers.PersonalChatConsumer.as_asgi()),
    re_path(r'ws/(?P<room_name>\w+)/$',consumers.ChatConsumer.as_asgi()),
    re_path(r'online/$',consumers.OnlineConsumer.as_asgi()),
]