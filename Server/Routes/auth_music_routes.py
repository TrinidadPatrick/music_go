import datetime
from fastapi import FastAPI, Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse, HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from requests_oauthlib import OAuth2Session
import os
from dotenv import load_dotenv
from db import get_db
from models import User, Songs, Library
from functools import reduce

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

load_dotenv()

router = APIRouter()

def format_total_duration(total_duration):
    minutes, seconds = divmod(total_duration, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours:02d} hours and {minutes:02d} minutes" if hours > 1200 else f"{minutes:02d} minutes and {seconds:02d} seconds"

@router.post("/save_song")
async def save_song(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    userId = request.state.user_id

    # Check if user is authenticated
    if userId:
        song = db.query(Songs).filter(Songs.song_id == data["videoId"]).first()
        # Check if song is already in the database
        if not song:
            song = Songs(
                song_id = data["videoId"],
                title = data["title"],
                artists = ", ".join(artist["name"] for artist in data["artists"]),
                album = data["album"],
                duration_seconds = data["duration_seconds"],
                thumbnail = data["thumbnails"][0]["url"],
            )
            db.add(song)
            db.commit()
    
        # Check is song is already in the user library
        library_song = db.query(Library).filter(Library.user_id == userId, Library.song_id == data["videoId"]).first()
        if not library_song:
            library_song = Library(
                user_id = userId,
                song_id = data["videoId"],
                created_at = datetime.datetime.now()
            )
            db.add(library_song)
            db.commit()
            db.refresh(library_song)
            return JSONResponse(content={"message": "song saved"}, status_code=200)
        else:
            return JSONResponse(content={"message": "song already saved"}, status_code=400)

    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)

@router.get("/get_library")
def get_library(request : Request, db: Session = Depends(get_db)):
    user_id = request.state.user_id
    if user_id:
        library_songs = db.query(Library).filter(Library.user_id == user_id).all()
        durations = [song.song.duration_seconds for song in library_songs]
        total_songs = len(library_songs)
        total_duration = sum(durations)
        data = [ 
        {
            "videoId": song.song.song_id,
            "title": song.song.title,
            "artists": song.song.artists.split(", "),
            "album": song.song.album,
            "duration_seconds": song.song.duration_seconds,
            "thumbnail": song.song.thumbnail,
            "created_at": song.created_at.isoformat()
        }
        for song in library_songs
    ]
        return JSONResponse(content={"data": {"total_songs": total_songs, "total_duration": format_total_duration(total_duration), "library_songs": data}}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)
