from django.db import models

# Create your models here.
class Track(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateTimeField()
    audiofile = models.FileField()

    def __str__(self):
        return self.name