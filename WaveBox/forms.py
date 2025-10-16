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
        fields = ("avatar", "bio",)

    def clean_avatar(self):
        avatar = self.cleaned_data.get("avatar")
        if not avatar:
            # если пользователь не загрузил новый — вернуть старый
            return self.instance.avatar
        return avatar

    def clean_bio(self):
        bio = self.cleaned_data.get("bio")
        if bio in [None, ""]:
            # если пользователь оставил пустым — вернуть старый текст
            return self.instance.bio
        return bio

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ("text",)

class MessageForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ("text",)

