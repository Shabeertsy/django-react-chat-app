from channels.generic.websocket import AsyncWebsocketConsumer,WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from django.contrib.auth.models import User
from .models import ChatMessage
from django.db import models
from asgiref.sync import sync_to_async
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from .models import Profile,FileUpload
from django.shortcuts import get_object_or_404





class PersonalChatConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def get_user_by_id(self,user_id):
        try:
            return Profile.objects.get(pk=user_id)
        except:
            return AnonymousUser()

    @sync_to_async
    def get_file_by_id(self,chat_id):
        try:
            chat=ChatMessage.objects.get(id=chat_id)
            chat_obj=FileUpload.objects.get(chat=chat)
            return [chat_obj.file_data,chat_obj.id]
        except Exception as e:
            print(e)
            return None

    @sync_to_async
    def save_chat_message(self, sender, receiver, message):
        chat_message = ChatMessage(
            sender=sender,
            receiver=receiver,
            message=message
        )
        chat_message.save()


    async def connect(self):
        print('current user',self.scope['user'])

        self.sender_id = self.scope['url_route']['kwargs']['sender_id']
        self.my_obj = self.scope['user']

        if self.my_obj.is_anonymous:
            await self.close()
            return

        self.other_user = await self.get_user_by_id(self.sender_id)
        if self.other_user.is_anonymous:
            await self.close()
            return

        
        if self.my_obj.id>self.other_user.id:
            self.room_name = f'{self.my_obj.id}-{self.other_user.id}'
        else:
            self.room_name = f'{self.other_user.id}-{self.my_obj.id}'


        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        try:
            self.history=await database_sync_to_async(self.chat_history)()
            for chat_message in self.history:
                msg_dict=chat_message['message']
                if chat_message['msg_type']=='file':
                    chat_id=chat_message['id']
                    chat_obj=await self.get_file_by_id(chat_id)
                    file_url=f'http://localhost:8000{chat_obj[0].url}'
                    
                    await self.send(text_data=json.dumps({
                    'mode':'file',
                    'message':'',
                    'sender_id':chat_message['sender_id'],
                    'file':file_url,
                    'file_id':chat_obj[1],

                    }))
                if chat_message['msg_type']=='text':

                    await self.send(text_data=json.dumps({
                    'message': chat_message['message'],
                    'sender_name': chat_message['sender_name'],
                    'sender_id':chat_message['sender_id']
                     }))
        except:
            pass


    async def disconnect(self, close_code):
        self.channel_layer.group_discard(
        self.room_group_name,
        self.channel_name
        )

    async def receive(self, text_data):
        receive_dict = json.loads(text_data)
        message = receive_dict['message']
        sender=receive_dict['sender_name']

        message_li={
            'message':message,
            'sender_name': sender,
            'sender_id':int(self.my_obj.id)
            }
        
        print(message)
        await self.save_chat_message(self.my_obj, self.other_user, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'send_msg',
                'message':message_li
            }
        )


    async def send_msg(self, event):
        receive_dict = event['message']
        await self.send(text_data=json.dumps(receive_dict))

    
    def chat_history(self):
        chat_history = ChatMessage.objects.filter(
            Q(sender=self.my_obj, receiver=self.other_user) |
            Q(sender=self.other_user, receiver=self.my_obj)
        ).order_by('-id')[0:20]

        reversed_chat_history = reversed(chat_history)


        messages_list=[]
        for chat_message in reversed_chat_history:
           messages_list.append({
            'id':chat_message.id,
            'message': chat_message.message,
            'sender_name': chat_message.sender.username,
            'reciever': chat_message.receiver.username,
            'sender_id':chat_message.sender.id,
            'msg_type':chat_message.type
            })

        return  messages_list




class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self,close_code):
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )


    async def receive(self,text_data):
        receive_dict=json.loads(text_data)
        message=receive_dict['message']
        action=receive_dict['action']


        if (action=='new-offer') or (action=='new-answer'):
            print('action,',action)
            receiver_channel_name=receive_dict['message']['receiver_channel_name']
            receive_dict['message']['receiver_channel_name']=self.channel_name

            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'type':'send.sdp',
                    'receive_dict':receive_dict
                }
            )
            return
        

        receive_dict['message']['receiver_channel_name']=self.channel_name
        print(receive_dict,'dict')

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'send_sdp',
                'receive_dict':receive_dict
            }
        )


    async def send_sdp(self, event):
        receive_dict = event['receive_dict']
        await self.send(text_data=json.dumps(receive_dict))


@sync_to_async
def send_status_list():
    status_list={}
    users=Profile.objects.filter(is_superuser=False)
    for user in users:
        status_list[str(user.id)]=user.online
    return status_list
        


class OnlineConsumer(AsyncWebsocketConsumer):
    @sync_to_async
    def set_online(self,user):
        try:
            profile=Profile.objects.get(pk=user.id)
            profile.online=True
            profile.save()
            return profile.online
        except Exception as e:
            return None
        
    @sync_to_async
    def set_offline(self,user):
        try:
            profile=Profile.objects.get(pk=user.id)
            profile.online=False
            profile.save()
            return profile.online
        except Exception as e:
            return None


    async def connect(self):
        self.room_group_name = f"online_list"
        self.user=self.scope['user']
        print('chat user',self.user)
        if self.user.is_anonymous:
            self.close()
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.status = await self.set_online(self.user)
        list=await send_status_list()
        
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type':'send_status',
                    'list':dict(list)
                }
         )
        await self.accept()


    async def disconnect(self,close_code):
        self.status_off=await self.set_offline(self.user)
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self,text_data):
        receive_dict=json.loads(text_data)
        message=receive_dict['message']


    async def send_status(self, event):
        status = event['list']
        await self.send(text_data=json.dumps(status))

