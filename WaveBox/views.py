from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .models import *
from Users.models import CustomUser



# Create your views here.

def main(request):
    return redirect("discover")


def discover(request):
    Tracks = Track.objects.all()
    return render(request, 'discover.html', {'Tracks': Tracks})

def track(request, track_id):
    track = Track.objects.get(pk=track_id)
    return render(request, 'track.html', {"track": track})
@login_required()
def library(request):
    liked_tracks = Track.objects.filter(liked_by=request.user)
    return render(request, 'library.html', {'liked_tracks': liked_tracks})

@login_required
def profile(request, username):
    user = CustomUser.objects.get(username=username)
    return render(request, "profile.html", {"user": user})

@login_required
def like_track(request, track_id):
    track = get_object_or_404(Track, pk=track_id)
    if request.user in track.liked_by.all():
        track.liked_by.remove(request.user)
        liked = False
    else:
        track.liked_by.add(request.user)
        liked = True
    return JsonResponse({"liked": liked})





