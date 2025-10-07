import random
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Prefetch, Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from .forms import TrackUploadForm
from .models import *
from Users.models import CustomUser



# Create your views here.
def test(request):
    sections = Section.objects.prefetch_related("tracks").all()
    return render(request, "test.html", {"sections": sections})


def main(request):
    return redirect("discover")


def discover(request):
    tracks = Track.objects.annotate(
        like_count=Count("liked_by")
    ).order_by("-like_count")

    sections = Section.objects.prefetch_related(
        Prefetch(
            "tracks", queryset=tracks
        )
    )

    return render(request, 'discover.html', {'Tracks': tracks, "sections": sections})

def track(request, track_id):
    track = Track.objects.get(pk=track_id)
    return render(request, 'track.html', {"t": track})
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
    like_count = track.like_count()
    return JsonResponse({"liked": liked, "like_count": like_count})

def upload(request):
    if request.method == "POST":
        form = TrackUploadForm(request.POST, request.FILES)
        if form.is_valid():
            track = Track.objects.create(
                name=form.cleaned_data["name"],
                author=request.user.username,
                audiofile=form.cleaned_data["audiofile"],
                image=form.cleaned_data["image"],
            )
            track.sections.add(Section.objects.get(name="Popular now"))
            Section.objects.get(name="Popular now").tracks.add(track)
            track.save()
            return redirect("/")

    form = TrackUploadForm()
    return render(request, "upload.html", {"form": form})

def search(request, query):
    tracks = Track.objects.filter(
        Q(name__icontains=query) | Q(author__icontains=query)
    )
    return render(request, "search.html", {"tracks": tracks, "query": query})








