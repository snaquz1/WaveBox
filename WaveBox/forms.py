from django import forms
from WaveBox.models import Track


class TrackUploadForm(forms.ModelForm):
    class Meta:
        model = Track
        fields = ("name", "image", "audiofile")

