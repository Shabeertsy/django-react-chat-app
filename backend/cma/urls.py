from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),
    path('add_task', views.add_task, name='add_task'),
    path('get-tasks/', views.get_tasks, name='get_tasks'),
    path('add-questions/', views.add_questions, name='add_questions'),
    path('delete-question/<int:question_id>/', views.delete_question, name='delete_question'),
    path('delete-task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('add_task_json/', views.bulk_add_tasks, name='add_task_json'),
]

