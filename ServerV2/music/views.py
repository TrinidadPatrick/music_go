import os

from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from pathlib import Path
from requests_oauthlib import OAuth2Session
from dotenv import load_dotenv
from ytmusicapi import OAuthCredentials, YTMusic

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(os.path.join(BASE_DIR, ".env"))

oauth_json = os.getenv("OAUTH_JSON")
GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("CLIENT_SECRET")

with open("oauth.json", "w") as f:
    f.write(oauth_json)

ytmusic = YTMusic("oauth.json", oauth_credentials=OAuthCredentials(client_id=GOOGLE_CLIENT_ID, client_secret=GOOGLE_CLIENT_SECRET))
ytmusicPublic = YTMusic()

def get_home(request):
    results = ytmusicPublic.get_home();
    return JsonResponse(results, safe=False)


def auto_complete_search(request):
    q = request.GET.get("q")
    try:
        results = ytmusic.get_search_suggestions(q,)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(e)

def search_music(request):
    q = request.GET.get("q")
    filter = request.GET.get("filter")
    limit = int(request.GET.get("limit"))
    filtered_results = ytmusic.search(query=q, filter=filter, limit=limit)
    return JsonResponse(filtered_results, safe=False)


def get_song(request):
    videoId = request.GET.get("videoId")   # /get_song/?videoId=xxxx
    results = ytmusic.get_song(videoId)
    return JsonResponse(results, safe=False)


def get_watch_playlist(request):
    videoId = request.GET.get("videoId")
    try:
        results = ytmusic.get_watch_playlist(videoId)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_watch_playlist: {e}")
        return JsonResponse({"error": "Failed to fetch playlist"}, status=500)


def get_playlist(request):
    playlistId = request.GET.get("playlistId")
    try:
        results = ytmusic.get_playlist(playlistId=playlistId)
        if results.get("privacy") == "PUBLIC":
            return JsonResponse(results, safe=False)
        else:
            return JsonResponse({"message": "This is a private playlist"}, status=401)
    except Exception as e:
        print(f"Error in get_playlist: {e}")
        return JsonResponse({"error": "Failed to fetch playlist"}, status=500)


def get_album(request):
    browseId = request.GET.get("browseId")
    try:
        results = ytmusic.get_album(browseId=browseId)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JsonResponse({"error": "Failed to fetch album"}, status=500)


def get_artist(request):
    artistId = request.GET.get("artistId")
    try:
        results = ytmusic.get_artist(artistId)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_artist: {e}")
        return JsonResponse({"error": "Failed to fetch artist"}, status=500)


def get_artist_albums(request):
    channelId = request.GET.get("channelId")
    params = request.GET.get("params")
    try:
        results = ytmusic.get_artist_albums(channelId=channelId, params=params)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_artist_albums: {e}")
        return JsonResponse({"error": "Failed to fetch artist albums"}, status=500)


def get_lyrics(request):
    browseId = request.GET.get("browseId")
    try:
        results = ytmusicPublic.get_lyrics(browseId, timestamps=True)
        if results and "lyrics" in results:
            results["lyrics"] = [
                {
                    "id": line.id,
                    "text": line.text,
                    "start_time": line.start_time,
                    "end_time": line.end_time
                }
                for line in results["lyrics"]
            ]

        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_lyrics: {e}")
        return JsonResponse({"error": "Failed to fetch lyrics"}, status=500)


def get_watch_playlist_public(request):
    videoId = request.GET.get("videoId")
    try:
        results = ytmusicPublic.get_watch_playlist(videoId=videoId)
        return JsonResponse(results, safe=False)
    except Exception as e:
        print(f"Error in get_watch_playlist_public: {e}")
        return JsonResponse({"error": "Failed to fetch playlist"}, status=500)