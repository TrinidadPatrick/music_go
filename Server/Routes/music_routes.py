from fastapi import APIRouter, Query
from ytmusicapi import YTMusic
from fastapi.responses import JSONResponse
from typing import Optional

router = APIRouter()
ytmusic = YTMusic()

@router.get("/charts")
def get_charts():
    try:
        results = ytmusic.get_charts(country="ZZ");
        return results
    except Exception as e:
        print(e)

@router.get("/home")
def get_homes():
    results = ytmusic.get_home();
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
    results = ytmusic.get_playlist(playlistId=playlistId);
    if results["privacy"] == "PUBLIC":
        return results
    else:
        return JSONResponse(content={"message", "this is a private playlist"}, status_code=401)

@router.get("/album")
def get_album(browseId: str = Query(...)):
    try:
        results = ytmusic.get_album(browseId=browseId)
        return results
    except Exception as e:
        print(f"Error in get_album: {e}")
        return JSONResponse(content={"error": "Failed to fetch album"}, status_code=500)

