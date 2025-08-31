import os
import jwt
import datetime
import urllib.parse

from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings
from pathlib import Path
from requests_oauthlib import OAuth2Session
from dotenv import load_dotenv

from .models import User, Playlist, PlaylistSong

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(os.path.join(BASE_DIR, ".env"))

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
BASE_URL = os.getenv("BASE_URL")

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

AUTHORIZATION_BASE_URL = 'https://accounts.google.com/o/oauth2/auth'
TOKEN_URL = 'https://oauth2.googleapis.com/token'
USER_INFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo'

SCOPE = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]


def generate_token(payload):
    print(SECRET_KEY)
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


# --------------------- USER INFO ---------------------

def get_user_info(request):
    user_id = request.session.get("user_id")
    if not user_id:
        return JsonResponse({"user": {}}, status=401)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"user": {}}, status=401)

    # playlist song counts
    # playlist_counts = (
    #     PlaylistSong.objects.values("playlist_id")
    #     .annotate(song_count=1)
    # )
    # playlist_song_counts = {p["playlist_id"]: p["song_count"] for p in playlist_counts}

    data = {
        "name": user.name,
        "email": user.email,
        "profile_image": user.profile_image,
        "playlists": [
            {
                "playlist_id": pl.playlist_id,
                "title": pl.title,
                "description": pl.description,
                "thumbnail": pl.thumbnail,
                "privacy": pl.privacy,
                "created_at": pl.created_at.isoformat(),
                # "song_count": playlist_song_counts.get(pl.playlist_id, 0),
            }
            for pl in user.playlist_set.all()
        ],
    }
    return JsonResponse({"user": data}, status=200)


# --------------------- LOGIN ---------------------

@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    import json
    data = json.loads(request.body)

    try:
        user = User.objects.get(email__iexact=data["email"], auth_provider="local")
    except User.DoesNotExist:
        return JsonResponse({"message": "Email or password is incorrect"}, status=401)

    if check_password(data["password"], user.password_hash):
        token = generate_token({
            "id": user.id,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        })
        response = JsonResponse({"message": "Logged in"}, status=200)
        response.set_cookie("access_token", token, httponly=True, secure=True, samesite="None")
        request.session["user_id"] = user.id
        return response
    else:
        return JsonResponse({"message": "Email or password is incorrect"}, status=401)


# --------------------- REGISTER ---------------------

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"message": "Method not allowed"}, status=405)

    import json
    data = json.loads(request.body)

    if User.objects.filter(email__iexact=data["email"]).exists():
        return JsonResponse({"message": "Email is already registered"}, status=409)

    user = User.objects.create(
        email=data["email"],
        name=data["name"],
        password_hash=make_password(data["password"]),
        google_id="",
        auth_provider="local",
        profile_image="",
    )

    token = generate_token({
        "id": user.id,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
    })

    response = JsonResponse({"message": "Registered"}, status=200)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="None")
    request.session["user_id"] = user.id
    return response


# --------------------- GOOGLE LOGIN ---------------------

def google_login(request):
    google = OAuth2Session(CLIENT_ID, scope=SCOPE, redirect_uri=REDIRECT_URI)
    authorization_url, state = google.authorization_url(
        AUTHORIZATION_BASE_URL,
        access_type="offline",
        prompt="select_account"
    )
    request.session["oauth_state"] = state
    return HttpResponseRedirect(authorization_url)


def google_callback(request):
    google = OAuth2Session(
        CLIENT_ID,
        state=request.session.get("oauth_state"),
        redirect_uri=REDIRECT_URI,
    )
    token = google.fetch_token(
        TOKEN_URL,
        client_secret=CLIENT_SECRET,
        authorization_response=request.build_absolute_uri(),
    )

    request.session["oauth_token"] = token
    resp = google.get(USER_INFO_URL)
    user_info = resp.json()

    email = user_info["email"]
    name = user_info["name"]
    profile_image = user_info.get("picture")
    google_id = user_info["id"]

    user, created = User.objects.get_or_create(
        email=email,
        defaults=dict(
            name=name,
            google_id=google_id,
            profile_image=profile_image,
            password_hash="",
            auth_provider="google",
        ),
    )

    if not created and user.auth_provider == "local":
        message = "Email is already registered to a local account"
        encoded_message = urllib.parse.quote(message)
        redirect_url = f"{BASE_URL}?message={encoded_message}"
        return HttpResponseRedirect(redirect_url)

    token = generate_token({
        "id": user.id,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
    })
    response = HttpResponseRedirect(BASE_URL)
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="None")
    request.session["user_id"] = user.id
    return response


# --------------------- LIST USERS ---------------------

def get_users(request):
    users = list(User.objects.values("id", "email", "name", "auth_provider"))
    return JsonResponse(users, safe=False)
