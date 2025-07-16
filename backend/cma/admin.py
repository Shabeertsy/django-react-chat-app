from django.contrib import admin
from .models import Task,QuestionsCompleted,PageVisitLog, Notes


admin.site.register(Task)
admin.site.register(QuestionsCompleted)
admin.site.register(PageVisitLog)
admin.site.register(Notes)