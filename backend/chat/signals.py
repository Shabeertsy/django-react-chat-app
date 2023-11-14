from django.dispatch import receiver
from .models import FileUpload,Profile
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



@receiver(post_save, sender=FileUpload)
def file_upload_handler(sender, instance, created, **kwargs):
    if created:
        if instance.chat.sender.id>instance.chat.receiver.id:
            room_name = f'{instance.chat.sender.id}-{instance.chat.receiver.id}'
        else:
            room_name = f'{instance.chat.receiver.id}-{instance.chat.sender.id}'
        file_url=f'http://localhost:8000{instance.file_data.url}'
        message_li={
            'mode':'file',
            'message':'',
            'file_id':instance.id,
            'sender_id':int(instance.chat.sender.id),
            'file':file_url
            }

        group_name = f'chat_{room_name}'
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_msg',
                'message': message_li 
            }
        )

@receiver(post_save, sender=Profile)
def file_upload_handler(sender, instance, created, **kwargs):
    
        status_list={}
        users=Profile.objects.filter(is_superuser=False)
        for user in users:
            status_list[str(user.id)]=user.online
        
        group_name = f"online_list"
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'send_status',
                'list': status_list
            }
        )