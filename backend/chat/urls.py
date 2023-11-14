from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('ws/<str:room_name>/',views.home,name='home'),
    path('chat-login/',views.login,name='login'),
    path('chat-registration/',views.registration_view,name='registration'),
    path('user-list/',views.list_users,name='list_users'),
    path('get-user/<int:user_id>/',views.get_user,name='get_user'),
    path('upload-files/<int:sender_id>/<int:rec_id>/',views.upload_files_chat,name='upload_files_chat'),
    path('download-file/<int:file_id>/',views.download_file,name='download_file'),




]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
