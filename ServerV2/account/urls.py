from django.urls import path
from .views import RegisterView, LoginView, UserInfoView, GoogleCallback, GoogleLoginStart

urlpatterns = [
    path("me/", UserInfoView.as_view(), name="user-info"),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    # path("playlists/", PlaylistListView.as_view(), name="playlist-list"),
    path("auth/login/google/", GoogleLoginStart.as_view(), name="google-login"),
    path("auth/callback/", GoogleCallback.as_view(), name="google-callback"),
    # path("users/", views.get_users),
]