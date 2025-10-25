from django import forms

from Users.models import CustomUser
from WaveBox.models import Track, Comment, Message
from WaveBox.scdownload import download_track


class TrackUploadForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ("name", "image", "audiofile", "sclink",)

    def clean(self):
        cleaned_data = super().clean()
        audiofile = cleaned_data.get("audiofile")
        sclink = cleaned_data.get("sclink")

        # Если ни одно из полей не заполнено
        if not audiofile and not sclink:
            raise forms.ValidationError("Нужно загрузить файл или вставить ссылку на SoundCloud.")

        return cleaned_data

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

