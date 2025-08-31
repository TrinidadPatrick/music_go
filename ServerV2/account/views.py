import os
import jwt
import datetime
import urllib.parse

from pathlib import Path
from dotenv import load_dotenv
from requests_oauthlib import OAuth2Session

from django.conf import settings
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.hashers import check_password

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .models import User, Playlist
from .serializer import UserSerializer, RegisterSerializer, PlaylistSerializer

# ---------- env ----------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

JWT_SECRET = os.getenv("JWT_SECRET_KEY") or settings.SECRET_KEY
BASE_URL = os.getenv("BASE_URL", "http://localhost:5173")

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

AUTHORIZATION_BASE_URL = "https://accounts.google.com/o/oauth2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
USER_INFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"

SCOPE = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
]

# Allow HTTP during local dev only (do NOT use in prod)
if settings.DEBUG:
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


# ---------- helpers ----------
def generate_token(payload: dict) -> str:
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def set_auth_cookie(response, token: str):
    # Cookie works cross-site with Vite (samesite=None requires secure=True)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="None",
    )
    return response


# ---------- views ----------
class UserInfoView(APIView):
    """
    Returns the authenticated user's profile + playlists.
    Relies on your custom middleware that sets request.user_id from JWT cookie.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user_id = getattr(request, "user_id", None)
 
        if not user_id:
            return Response({"user": {}}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"user": {}}, status=status.HTTP_401_UNAUTHORIZED)

        data = UserSerializer(user).data

        return Response({"user": data}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")  # keeping cookie-based auth simple for now
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            user = User.objects.get(email__iexact=email, auth_provider="local")
        except User.DoesNotExist:
            return Response({"message": "Email or password is incorrect"}, status=401)

        if not check_password(password, user.password_hash):
            return Response({"message": "Email or password is incorrect"}, status=401)

        token = generate_token({
            "id": user.id,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        })

        resp = Response({"message": "Logged in"}, status=200)
        set_auth_cookie(resp, token)
        request.session["user_id"] = user.id
        return resp


@method_decorator(csrf_exempt, name="dispatch")
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # prevent duplicate emails
        if User.objects.filter(email__iexact=request.data.get("email")).exists():
            return Response({"message": "Email is already registered"}, status=409)

        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = serializer.save()

        token = generate_token({
            "id": user.id,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        })

        resp = Response({"message": "Registered"}, status=200)
        set_auth_cookie(resp, token)
        request.session["user_id"] = user.id
        return resp


class GoogleLoginStart(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        google = OAuth2Session(CLIENT_ID, scope=SCOPE, redirect_uri=REDIRECT_URI)
        authorization_url, state = google.authorization_url(
            AUTHORIZATION_BASE_URL, access_type="offline", prompt="select_account"
        )
        request.session["oauth_state"] = state
        return HttpResponseRedirect(authorization_url)


class GoogleCallback(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
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
                password_hash="",  # no local password
                auth_provider="google",
            ),
        )

        # If user exists but registered locally, block Google login
        if not created and user.auth_provider == "local":
            message = "Email is already registered to a local account"
            encoded = urllib.parse.quote(message)
            redirect_url = f"{BASE_URL}?message={encoded}"
            return HttpResponseRedirect(redirect_url)

        token = generate_token({
            "id": user.id,
            "iat": datetime.datetime.utcnow(),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        })

        response = HttpResponseRedirect(BASE_URL)
        set_auth_cookie(response, token)
        request.session["user_id"] = user.id
        return response


class UsersListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        users = User.objects.values("id", "email", "name", "auth_provider")
        return Response(list(users), status=200)


class MyPlaylistsView(APIView):
    """
    Optional: get only current user's playlists
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user_id = getattr(request, "user_id", None)
        if not user_id:
            return Response({"detail": "Unauthorized"}, status=401)

        qs = Playlist.objects.filter(user_id=user_id).order_by("-created_at")
        data = PlaylistSerializer(qs, many=True).data
        return Response({"playlists": data}, status=200)
