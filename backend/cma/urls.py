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
    path('mark-task-completed/<int:pk>/', views.mark_task_completed, name='mark_task_completed'),
    path('update-task/<int:pk>/', views.update_task, name='update_task'),
    path('update-question-progress/<int:pk>/', views.update_question_progress, name='update_question_progress'),
    path('create-question/',views.generate_questions_from_tasks, name='create_question_from_chapters'),
    path('login/', views.login_view, name='login'),
    
]

