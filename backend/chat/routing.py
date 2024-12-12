from django.urls import re_path

from . import consumers 

websocket_urlpatterns=[
    re_path(r'api/chat/(?P<sender_id>\w+)/$', consumers.PersonalChatConsumer.as_asgi()),
    re_path(r'api/ws/(?P<room_name>\w+)/$',consumers.ChatConsumer.as_asgi()),
    re_path(r'api/online/$',consumers.OnlineConsumer.as_asgi()),
]