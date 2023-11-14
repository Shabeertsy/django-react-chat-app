
import jwt
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import StudentExamCredentials
from eduskill import settings

class IsStudent(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')

        if auth_header is None:
            raise AuthenticationFailed('Authentication failed')

        try:
            auth_type, token = auth_header.split(' ')
            if auth_type.lower() != 'bearer':
                raise AuthenticationFailed('Authentication failed')

            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            username = payload.get('username')
            password = payload.get('password')

            credentials = StudentExamCredentials.objects.get(username=username, password=password)
            if credentials.completed == True:
                raise AuthenticationFailed('Exam completed , login failed ')
                
            return (credentials, None)  
        except (jwt.ExpiredSignatureError, jwt.DecodeError, StudentExamCredentials.DoesNotExist):
            raise AuthenticationFailed('Authentication failed')
