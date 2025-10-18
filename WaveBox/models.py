from typing import Any

from django.core.validators import FileExtensionValidator
from django.db import models
from django.db.models import ForeignKey
from django.utils.functional import empty

from WaveBoxV2 import settings


# Create your models here.



class Track(models.Model):
    name = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    audiofile = models.FileField(upload_to="audiofiles", validators=[FileExtensionValidator(allowed_extensions=["mp3"])])
    image = models.ImageField(upload_to='images/trackimages')
    liked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        through='TrackLike',
    )
    sections = models.ManyToManyField("Section", blank=True, default=["Popular now"])


    def __str__(self):
        return self.name

    def like_count(self):
        return self.liked_by.count()



class TrackLike(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)


class Section(models.Model):
    name = models.CharField(max_length=100)
    tracks = models.ManyToManyField("Track", blank=True)

    def __str__(self):
        return self.name

class Comment(models.Model):
    track = models.ForeignKey("Track", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.track}-{self.text}"


class Chat(models.Model):
    user1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats_as_user1')
    user2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chats_as_user2')

    class Meta:
        # Уникальность на КОМБИНАЦИЮ полей
        unique_together = ['user1', 'user2']

    def __str__(self):
        return f"Chat between {self.user1.username} and {self.user2.username}"

class Message(models.Model):
    message_types = [
        ("text", "text"),
        ("track", "track"),
    ]
    chat = models.ForeignKey("Chat", on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    msg_type = models.CharField(
        choices=message_types,
        default="text",
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.text}"





