from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializer import ProfileSerializer
import random
from .models import *
from datetime import datetime, timedelta
from django.utils import timezone
from .permissions import *

from django.http import HttpResponse
from django.conf import settings
from django.core.exceptions import SuspiciousFileOperation
import os

# Create your views here.
def home(request,room_name):
    context={}
    return render (request,'main.html',context=context)



@api_view(['POST'])
def registration_view(request):
    if request.method == 'POST':
        serializer = ProfileSerializer(data=request.data)

        if serializer.is_valid():
            user=serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    username = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token['name'] = user.first_name
        token = {
            'refresh': str(refresh),
            'access': str(access_token),
            'email':user.email,
            'user_id':user.id
        }
        return Response(token)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
def list_users(request):
    if request.method=='GET':
        queryset=Profile.objects.filter(is_superuser=False)
        serializer=ProfileSerializer(queryset,many=True)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def get_user(request,user_id):
    if request.method=='GET':
        user_obj=Profile.objects.filter(is_superuser=False,pk=user_id).first()
        serializer=ProfileSerializer(user_obj)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  

@api_view(['POST'])
def upload_files_chat(request,sender_id,rec_id):
    if request.method=='POST':
        sender=get_object_or_404(Profile,pk=sender_id)
        receiver=get_object_or_404(Profile,pk=rec_id)
        files=request.FILES.get('file')
        msg_obj=ChatMessage.objects.create(
            sender=sender,
            receiver=receiver,
            message='',
            type='file'
        )
        data=FileUpload.objects.create(file_data=files,chat=msg_obj)

    return Response({'msg':'file send success'}, status=status.HTTP_200_OK)
  

@api_view(['GET'])
def download_file(request, file_id):
    file_object = get_object_or_404(FileUpload, pk=file_id)

    try:
        file_path = file_object.file_data.path
        if not file_path.startswith(settings.MEDIA_ROOT):
            raise SuspiciousFileOperation("Attempted access outside of MEDIA_ROOT")
    except Exception as e:
        return HttpResponse("Invalid file path", status=400)

    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename={os.path.basename(file_path)}'
            return response
    else:
        return HttpResponse("File not found", status=404)