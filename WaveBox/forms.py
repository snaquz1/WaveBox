from django import forms

from Users.models import CustomUser
from WaveBox.models import Track


class TrackUploadForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ("name", "image", "audiofile")

class AvatarChangingForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ("avatar",)

