from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import *



# Create your views here.

def main(request):
    return redirect("discover")


def discover(request):
    Tracks = Track.objects.all()
    return render(request, 'discover.html', {'Tracks': Tracks})

def track(request, track_id):
    track = Track.objects.get(pk=track_id)
    return render(request, 'track.html', {"track": track})



