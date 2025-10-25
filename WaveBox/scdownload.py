import os
import yt_dlp
from WaveBoxV2.settings import BASE_DIR

FFMPEG_PATH = os.path.join(BASE_DIR, "WaveBox", "ffmpeg", "bin")
OUTPUT_DIR = os.path.join(BASE_DIR, "media", "audiofiles")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def download_track(url):
    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(OUTPUT_DIR, "%(title)s.%(ext)s"),
        "ffmpeg_location": FFMPEG_PATH,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
        filename = os.path.splitext(filename)[0] + ".mp3"
        return filename
