from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.contrib.auth.models import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)



# Create your models here.
class BaseClass(models.Model):
    uuid = models.SlugField(default=uuid.uuid4, unique=True)
    active_status = models.BooleanField(default=True)
    created_date_time = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract=True


class Profile(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    profile_image = models.ImageField(null=True,blank=True,upload_to='profile_images')
    email=models.EmailField(unique=True)
    bio=models.TextField(null=True,blank=True)
    groups = models.ManyToManyField('auth.Group',blank=True,related_name='user_profiles',related_query_name='user_profile',)
    user_permissions = models.ManyToManyField('auth.Permission',blank=True,related_name='user_profiles',related_query_name='user_profile',)
    verify=models.BooleanField(default=False)
    first_name=models.CharField(max_length=200,null=True,blank=True)
    last_name=models.CharField(max_length=200,null=True,blank=True)
    online=models.BooleanField(default=False)
    objects = CustomUserManager()

    def  __str__(self):
        return self.email 

    class Meta:
        ordering = ['-id']
        verbose_name = 'Profile'
        verbose_name_plural = 'Profile'


class ChatMessage(models.Model):
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    type=models.CharField(max_length=10,default='text')

    def __str__(self):
        return f'{self.sender.first_name}-{self.receiver.first_name}'
    


class FileUpload(models.Model):
    file_data=models.FileField(null=True,blank=True,upload_to='uploads/')
    chat=models.ForeignKey(ChatMessage,on_delete=models.CASCADE,null=True,blank=True)

    def __str__(self):
        return f'{self.chat.sender.first_name}-{self.chat.receiver.first_name}'
    
