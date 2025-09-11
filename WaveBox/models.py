from django.db import models



# Create your models here.
class Track(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    audiofile = models.FileField(upload_to="audiofiles")
    image = models.ImageField(upload_to='images/trackimages')

    def __str__(self):
        return self.name