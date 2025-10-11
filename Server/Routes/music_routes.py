import json

from fastapi import APIRouter, Query, HTTPException
from ytmusicapi import OAuthCredentials, YTMusic
from fastapi.responses import JSONResponse
from typing import Optional
from dotenv import load_dotenv
import logging
import os

load_dotenv()


oauth_json = os.getenv("OAUTH_JSON")
GOOGLE_CLIENT_ID = os.getenv("CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("CLIENT_SECRET")



with open("oauth.json", "w") as f:
    f.write(oauth_json)

oauth_credentials = OAuthCredentials(
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET
)

router = APIRouter()
ytmusic = YTMusic("oauth.json", oauth_credentials=oauth_credentials)
ytmusicPublic = YTMusic()

@router.get("/charts")
def get_charts():
    try:
        results = ytmusicPublic.get_charts(country="US")
        return results
    except Exception as e:
        print(e)

@router.get("/home")
def get_homes():
    results = ytmusicPublic.get_home()
    return results

@router.get("/autoComplete")
def auto_complete_search(q: str = Query(...)):
    try:
        results = ytmusicPublic.get_search_suggestions(q,)
        return results
    except Exception as e:
        print(e)

@router.get("/search")
def search_music(q: str = Query(...), filter=Query(...), limit : int =Query(...)):
    filtered_results = ytmusicPublic.search(query=q, filter=filter, limit=limit)
    return filtered_results

@router.get("/song")
def get_song(videoId: str = Query(...)):
    results = ytmusic.get_song(videoId)
    return results

@router.get("/next_song_reco")
def get_watch_playlist(videoId: str = Query(...)):
    try:
        results = ytmusicPublic.get_watch_playlist(videoId)
        return results
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JSONResponse(content={"error": "Failed to fetch album"}, status_code=500)

@router.get("/playlist")
def get_playlist(playlistId: str = Query(...)):
    try:
        results = ytmusicPublic.get_playlist(playlistId=playlistId)
        if results["privacy"] == "PUBLIC":
            return results
        else:
            return JSONResponse(content={"message", "this is a private playlist"}, status_code=401)
    except Exception as e:
        print(f"Error in get_playlist: {e}")
        return JSONResponse(content={"error": "Failed to fetch playlist"}, status_code=500)

@router.get("/album")
def get_album(browseId: str = Query(...)):
    try:
        results = ytmusicPublic.get_album(browseId=browseId)
        return results
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JSONResponse(content={"error": "Failed to fetch album"}, status_code=500)

@router.get('/artist')
def get_artist(artistId: str = Query(...)):
    try:
        results = ytmusicPublic.get_artist(artistId)
        return results
    except Exception as e:
        print(f"Error in get_artist: {e}")
        return JSONResponse(content={"error": "Failed to fetch artist"}, status_code=500)
    
@router.get('/artist/albums')
def get_artist_albums(channelId: str = Query(...), params: str = Query(...)):
    try:
        results = ytmusicPublic.get_artist_albums(channelId=channelId, params=params)
        return results
    except Exception as e:
        print(f"Error in get_artist_albums: {e}")
        return JSONResponse(content={"error": "Failed to fetch artist albums"}, status_code=500)

@router.get('/lyrics')
def get_lyrics(browseId: str = Query(...)):
    try:
        results = ytmusicPublic.get_lyrics(browseId, timestamps=True)
        return results
    except Exception as e:
        print(f"Error in get_lyrics: {e}")
        return JSONResponse(content={"error": "Failed to fetch lyrics"}, status_code=500)
    
@router.get("/get_watch_playlist")
def get_watch_playlist_public(videoId: str = Query(...)):
    try:
        results = ytmusicPublic.get_watch_playlist(videoId=videoId)
        return results
    except Exception as e:
        print(e)