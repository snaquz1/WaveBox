from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin', admin.site.urls),
    path("", main, name="main" ),
    path("discover", discover, name="discover"),
    path("track/<int:track_id>", track, name="track" ),
    path("player", player, name="player" ),
]