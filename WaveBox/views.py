import random
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Prefetch, Q, Case, When, CharField
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.shortcuts import render, redirect, get_object_or_404
from .forms import TrackUploadForm, AvatarChangingForm, CommentForm, MessageForm
from .models import *
from Users.models import CustomUser


def generate_random_recs():
    return Track.objects.all().order_by("?")[:7]


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
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            Comment.objects.create(
                text=form.cleaned_data["text"],
                track=Track.objects.get(pk=track_id),
                user=request.user,
            ).save()
            request.session["comment_wrote"] = True
            return redirect(f"/track/{track_id}")
    comments = Comment.objects.filter(track_id=track_id).order_by("-date")
    track = Track.objects.get(pk=track_id)
    form = CommentForm
    if request.session.get("comment_wrote"):
        del request.session["comment_wrote"]
        comment_wrote = True
    else:
        comment_wrote = False
    return render(request, 'track.html', {"t": track, "comments": comments, "form": form, "comment_wrote": comment_wrote})


@login_required()
def library(request):
    liked_tracks = Track.objects.filter(liked_by=request.user)
    return render(request, 'library.html', {'liked_tracks': liked_tracks})

@login_required
def profile(request, username):
    user = get_object_or_404(CustomUser, username=request.user.username)
    if request.method == "POST":
        form = AvatarChangingForm(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            return redirect(f"/profile/{request.user.username}")
    form = AvatarChangingForm(initial={"bio": user.bio})
    user = CustomUser.objects.get(username=username)
    user_tracks = Track.objects.filter(author=user.username)
    user_liked_tracks = Track.objects.filter(liked_by=user)
    if username == request.user.username:
        user_chats = Chat.objects.filter(
            Q(user1=request.user) | Q(user2=request.user)
        ).select_related('user1', 'user2')
    else:
        user_chats = None

    return render(request, "profile.html", {"user": user, "form": form, "user_tracks": user_tracks, "user_liked_tracks": user_liked_tracks, "user_chats": user_chats})

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
    profiles = CustomUser.objects.filter(
        Q(username__icontains=query)
    )
    random_recs = generate_random_recs()
    return render(request, "search.html", {"tracks": tracks, "profiles": profiles, "query": query, "random_recs": random_recs})

def chat(request, username):
    user2 = get_object_or_404(CustomUser, username=username)
    try:
        chat = Chat.objects.get(
            Q(user1=request.user, user2=user2) |
            Q(user1=user2, user2=request.user)
        )
    except Chat.DoesNotExist:
       chat = Chat.objects.create(
            user1=request.user,
            user2=user2,
        )

    if request.method == "POST":
        form = MessageForm(request.POST)
        if form.is_valid():
            message = Message.objects.create(
                chat=chat,
                text=form.cleaned_data["text"],
                sender=request.user,
            ).save()

    messages = Message.objects.filter(chat=chat)
    form = MessageForm()
    return render(request, "chat.html", {"chat": chat, "messages": messages, "form": form, "username": username})









