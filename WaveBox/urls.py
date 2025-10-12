from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('admin', admin.site.urls),
    path("test", test, name="test"),
    path("", main, name="main" ),
    path("discover", discover, name="discover"),
    path("track/<int:track_id>", track, name="track" ),
    path("profile/<str:username>", profile, name="profile"),
    path("liketrack/<int:track_id>", like_track, name="like_track"),
    path("library", library, name="library"),
    path("upload", upload, name="upload"),
    path("search/<str:query>", search, name="search"),
    path("chat/<str:username>", chat, name="chat"),

]