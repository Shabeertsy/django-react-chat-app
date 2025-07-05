from django.db import models
from chat.models import Profile


class PageVisitLog(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE,null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    path = models.CharField(max_length=255)
    visited_at = models.DateTimeField()

    def __str__(self):
        return f"{self.user.username} visited {self.path} at {self.visited_at}"



class Task(models.Model):

    SECTION_CHOICES = [(chr(i), chr(i)) for i in range(65, 71)] 

    section = models.CharField(max_length=100, null=True, blank=True,choices=SECTION_CHOICES)
    chapter_name = models.CharField(max_length=100, null=True, blank=True)
    unit = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    day_number = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    comments = models.TextField(null=True, blank=True)

    # def __str__(self):
    #     return self.chapter_name
    

class QuestionsCompleted(models.Model):

    SECTION_CHOICES = [(chr(i), chr(i)) for i in range(65, 71)] 
    section = models.CharField(max_length=100, null=True, blank=True,choices=SECTION_CHOICES)
    unit = models.CharField(max_length=100, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)

    number_of_questions = models.IntegerField(default=0)
    number_of_questions_completed = models.IntegerField(default=0)
    number_of_essay_questions_completed = models.IntegerField(default=0)
    number_of_essay_questions = models.IntegerField(default=0)

    def __str__(self):
        return f"Question for {self.section}: {self.unit}"
    
