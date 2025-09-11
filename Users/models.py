from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # Добавляем дополнительные поля
    username = models.CharField(max_length=20, unique=True)
    avatar = models.ImageField(upload_to="images/user_avatars", null=True, blank=True)

    def __str__(self):
        return self.username