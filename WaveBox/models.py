from typing import Any

from django.db import models
from django.db.models import ForeignKey
from django.utils.functional import empty

from WaveBoxV2 import settings


# Create your models here.
class Track(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    audiofile = models.FileField(upload_to="audiofiles")
    image = models.ImageField(upload_to='images/trackimages')
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
    )
    sections = models.ManyToManyField("Section", blank=True, default=["Popular now"])


    def __str__(self):
        return self.name

    def like_count(self):
        return self.liked_by.count()

class Section(models.Model):
    name = models.CharField(max_length=100)
    tracks = models.ManyToManyField("Track", blank=True)

    def __str__(self):
        return self.name






