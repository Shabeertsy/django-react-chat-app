import os
import django

# Set the settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms.settings')

# Initialize Django (necessary before importing models or other Django-specific components)
django.setup()

from django.conf import settings
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import chat.routing
from chat.auth import TokenAuthMiddleWare

# Get the ASGI application to handle HTTP requests
django_asgi_app = get_asgi_application()

# Define the ASGI application with WebSocket handling
application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Handles HTTP requests
    'websocket': TokenAuthMiddleWare(
        URLRouter(
            chat.routing.websocket_urlpatterns  # WebSocket routing
        )
    ),
})
