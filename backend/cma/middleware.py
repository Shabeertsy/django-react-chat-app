# middleware.py

import datetime
from django.utils.timezone import now
from .models import PageVisitLog

class PageVisitLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        print('request.path', request.path)

        # Only track authenticated users
        if request.user.is_authenticated and request.path == '/api/cma/':
            ip = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            PageVisitLog.objects.create(
                user=request.user,
                ip_address=ip,
                user_agent=user_agent,
                path=request.path,
                visited_at=now()
            )

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
