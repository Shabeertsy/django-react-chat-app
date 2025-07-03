from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),
    path('add_task', views.add_task, name='add_task'),
    path('get-tasks/', views.get_tasks, name='get_tasks'),
    path('add-questions/', views.add_questions, name='add_questions'),
]

