from django import forms

from Users.models import CustomUser
from WaveBox.models import Track, Comment, Message


class TrackUploadForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ("name", "image", "audiofile")

class AvatarChangingForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ("avatar",)

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ("text",)

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ("text",)

