from django.db import models


# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    bio=models.TextField(null=True,blank=True)

    def __str__(self):
        return self.name
    




class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True,blank=True)
    start_date = models.DateField(null=True,blank=True)
    end_date = models.DateField(null=True,blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tags=models.TextField(null=True,blank=True)
    is_published = models.BooleanField(default=True)

    def __str__(self):
        return self.title
    

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField() 
    review = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.name} - {self.course.title}' 