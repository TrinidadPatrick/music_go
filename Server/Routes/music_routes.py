from fastapi import APIRouter, Query, HTTPException
from ytmusicapi import YTMusic
from fastapi.responses import JSONResponse
from typing import Optional
from dotenv import load_dotenv
import logging
import os

load_dotenv()


browser_json = os.getenv("YTMUSIC_BROWSER_JSON")

with open("browser.json", "w") as f:
    f.write(browser_json)

router = APIRouter()
ytmusic = YTMusic("browser.json")

# @router.get("/charts")
# def get_charts():
#     try:
#         results = ytmusic.get_charts(country="US");
#         return results
#     except Exception as e:
#         print(e)

@router.get("/home")
def get_homes():
    print("Hello")
    results = ytmusic.get_home();
    print(results)
    return results

@router.get("/autoComplete")
def auto_complete_search(q: str = Query(...)):
    try:
        results = ytmusic.get_search_suggestions(q,)
        return results
    except Exception as e:
        print(e)

@router.get("/search")
def search_music(q: str = Query(...), filter=Query(...), limit : int =Query(...)):
    filtered_results = ytmusic.search(query=q, filter=filter, limit=limit)
    return filtered_results

@router.get("/song")
def get_song(videoId: str = Query(...)):
    results = ytmusic.get_song(videoId)
    return results

@router.get("/next_song_reco")
def get_watch_playlist(videoId: str = Query(...)):
    try:
        results = ytmusic.get_watch_playlist(videoId)
        return results
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JSONResponse(content={"error": "Failed to fetch album"}, status_code=500)

@router.get("/playlist")
def get_playlist(playlistId: str = Query(...)):
    try:
        results = ytmusic.get_playlist(playlistId=playlistId);
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
        results = ytmusic.get_album(browseId=browseId)
        return results
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JSONResponse(content={"error": "Failed to fetch album"}, status_code=500)

@router.get('/artist')
def get_artist(artistId: str = Query(...)):
    try:
        results = ytmusic.get_artist(artistId)
        return results
    except Exception as e:
        print(f"Error in get_artist: {e}")
        return JSONResponse(content={"error": "Failed to fetch artist"}, status_code=500)
    
@router.get('/artist/albums')
def get_artist_albums(channelId: str = Query(...), params: str = Query(...)):
    try:
        results = ytmusic.get_artist_albums(channelId=channelId, params=params)
        return results
    except Exception as e:
        print(f"Error in get_artist_albums: {e}")
        return JSONResponse(content={"error": "Failed to fetch artist albums"}, status_code=500)

@router.get('/lyrics')
def get_lyrics(browseId: str = Query(...)):
    try:
        results = ytmusic.get_lyrics(browseId, timestamps=True)
        return results
    except Exception as e:
        print(f"Error in get_lyrics: {e}")
        return JSONResponse(content={"error": "Failed to fetch lyrics"}, status_code=500)
    
@router.get("/get_watch_playlist")
def get_watch_playlist(videoId: str = Query(...)):
    try:
        results = ytmusic.get_watch_playlist(videoId=videoId)
        return results
    except Exception as e:
        print(e)