from django.urls import path
from . import views

urlpatterns = [
    path("me/", views.get_user_info),
    path("auth/login/", views.login),
    path("auth/register/", views.register),
    # path("auth/login/google/", views.google_login),
    # path("auth/callback/", views.google_callback),
    # path("users/", views.get_users),
]