from django.urls import path
from . import views

urlpatterns = [
    path("home/", views.get_home),
    path("autoComplete/", views.auto_complete_search),
    path("search/", views.search_music),
    path("song/", views.get_song),
    path("next_song_reco/", views.get_watch_playlist),
    path("get_watch_playlist/", views.get_watch_playlist_public),
    path("lyrics/", views.get_lyrics),
]