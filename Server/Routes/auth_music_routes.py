import datetime
from fastapi import FastAPI, Request, APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session, aliased
from fastapi.responses import RedirectResponse, HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from requests_oauthlib import OAuth2Session
import os
from dotenv import load_dotenv
from db import get_db, SessionLocal
from models import User, Songs, Library, Playlist, PlaylistSong
from functools import reduce
import random
import string

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

load_dotenv()

router = APIRouter()

def insert_song_if_needed(data: dict):
    db = SessionLocal()  # ⚠️ You must create a new session manually in background task
    try:
        song = db.query(Songs).filter(Songs.song_id == data["videoId"]).first()

        if not song:
            new_song = Songs(
                song_id=data["videoId"],
                title=data["title"],
                artists=", ".join(artist["name"] for artist in data["artists"]),
                album=data["album"] if data["album"] else None,
                duration_seconds=data["duration_seconds"],
                thumbnail=data["thumbnails"][0]["url"] if data["thumbnails"] else None,
            )
            db.add(new_song)
            db.commit()
    finally:
        db.close()

def generate_random_string(length=20):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choices(characters, k=length))

def format_total_duration(total_seconds):
    minutes, seconds = divmod(total_seconds, 60)
    hours, minutes = divmod(minutes, 60)

    if hours > 0:
        return f"{hours:02d} hours and {minutes:02d} minutes"
    else:
        return f"{minutes:02d} minutes and {seconds:02d} seconds"


@router.post("/save_song")
async def save_song(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    user_id = request.state.user_id

    if not user_id:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)

    video_id = data.get("videoId")
    title = data.get("title")
    album = data.get("album") or None
    duration_seconds = data.get("duration_seconds")

    artist_names = ", ".join(
        artist["name"] for artist in data.get("artists", []) if isinstance(artist, dict)
    )
    thumbs = data.get("thumbnails", [])
    thumbnail = thumbs[0]["url"] if thumbs and isinstance(thumbs[0], dict) else None

    # Insert song into Songs table if it doesn't exist
    song = db.query(Songs).filter(Songs.song_id == video_id).first()
    if not song:
        song = Songs(
            song_id=video_id,
            title=title,
            artists=artist_names,
            album=album,
            duration_seconds=duration_seconds,
            thumbnail=thumbnail,
        )
        db.add(song)
        db.commit()

    # Check if the song is already in user library
    library_entry = db.query(Library).filter(
        Library.user_id == user_id,
        Library.song_id == video_id
    ).first()

    if not library_entry:
        library_entry = Library(
            user_id=user_id,
            song_id=video_id,
            created_at=datetime.datetime.now()
        )
        db.add(library_entry)
        db.commit()
        return JSONResponse(content={"message": "song saved to library"}, status_code=200)
    else:
        db.delete(library_entry)
        db.commit()
        return JSONResponse(content={"message": "song deleted"}, status_code=200)

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

@router.post("/create_playlist")
async def save_playlist(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    userId = request.state.user_id

    # Check if user is authenticated
    if userId:
        playlist = db.query(Playlist).filter(Playlist.title == data["title"], Playlist.user_id == userId).first()

        if playlist:
            return JSONResponse(content={"message": "playlist already exists"}, status_code=400)
        
        # if not in DB then create a new playlist
        elif not playlist:
            playlist = Playlist(
                playlist_id = generate_random_string(),
                user_id = userId,
                title = data["title"],
                description = data["description"],
                thumbnail = data["thumbnail"],
                privacy = data["privacy"],
                created_at = datetime.datetime.now()
            )
            db.add(playlist)
            db.commit()
            db.refresh(playlist)
            return JSONResponse(content={"message": "playlist created"}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.patch("/update_playlist")
async def update_playlist(request: Request, playlistId: str = Query(...), db: Session = Depends(get_db)):
    data = await request.json()
    userId = request.state.user_id

    # Check if user is authenticated
    if userId:
        playlist = db.query(Playlist).filter(Playlist.playlist_id == playlistId, Playlist.user_id == userId).first()

        print(playlist)

        if playlist:
            playlist.title = data['title'],
            playlist.description = data['description'],
            playlist.privacy = data['privacy']

            db.commit()
            return JSONResponse(content={"message": "playlist updated"}, status_code=200)
        
        # if not in DB then create a new playlist
        elif not playlist:
            return JSONResponse(content={"message": "playlist not found"}, status_code=404)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.delete("/delete_playlist")
async def delete_playlist(request: Request, playlistId: str = Query(...), db: Session = Depends(get_db)):
    userId = request.state.user_id

    # Check if user is authenticated
    if userId:
        playlist = db.query(Playlist).filter(Playlist.playlist_id == playlistId, Playlist.user_id == userId).first()

        if playlist:
            print(playlist)
            db.delete(playlist)
            db.commit()
            return JSONResponse(content={"message": "playlist deleted"}, status_code=200)
        
        # if not in DB then create a new playlist
        elif not playlist:
            return JSONResponse(content={"message": "playlist not found"}, status_code=404)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.get("/get_playlists")
def get_playlists(request : Request, db: Session = Depends(get_db)):
    user_id = request.state.user_id
    if user_id:
        song_counts_subquery = (
            db.query(
                PlaylistSong.playlist_id,
                func.count(PlaylistSong.id).label("song_count")
            )
            .group_by(PlaylistSong.playlist_id)
            .subquery()
        )

        total_duration_subquery = (
            db.query(
                PlaylistSong.playlist_id,
                func.sum(Songs.duration_seconds).label("total_duration")
            )
            .join(Songs, Songs.song_id == PlaylistSong.song_id)
            .group_by(PlaylistSong.playlist_id)
            .subquery()
        )

        SC = aliased(song_counts_subquery)
        TD = aliased(total_duration_subquery)

        playlists = db.query(Playlist, SC.c.song_count, TD.c.total_duration).outerjoin(SC, Playlist.playlist_id == SC.c.playlist_id).outerjoin(TD, Playlist.playlist_id == TD.c.playlist_id).filter(Playlist.user_id == user_id).all()
        
        if playlists:
            data = [
                {
                    "playlist_id": playlist.playlist_id,
                    "title": playlist.title,
                    "description": playlist.description,
                    "thumbnail": playlist.thumbnail,
                    "privacy": playlist.privacy,
                    "created_at": playlist.created_at.isoformat(),
                    "song_count" : sc or 0,
                    "total_duration" : format_total_duration(int(td or 0))
                }
                for playlist, sc, td in playlists
            ]
            return JSONResponse(content={"data": {"total_playlists": len(playlists), "playlists": data}}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)
    
@router.get("/get_playlist_details")
def get_playlist_details(request : Request, db: Session = Depends(get_db)):
    user_id = request.state.user_id
    playlist_id = request.query_params.get("playlistId")

    if user_id:
        song_counts_subquery = (
                        db.query(
                            PlaylistSong.playlist_id,
                            func.count(PlaylistSong.id).label("song_count")
                        )
                        .group_by(PlaylistSong.playlist_id)
                        .subquery()
        )

        # Subquery: total duration
        total_duration_subquery = (
            db.query(
                PlaylistSong.playlist_id,
                func.sum(Songs.duration_seconds).label("total_duration")
            )
            .join(Songs, Songs.song_id == PlaylistSong.song_id)
            .group_by(PlaylistSong.playlist_id)
            .subquery()
        )

        # Main query with outer joins
        playlist = (
            db.query(
                Playlist,
                song_counts_subquery.c.song_count,
                total_duration_subquery.c.total_duration
            )
            .outerjoin(song_counts_subquery, Playlist.playlist_id == song_counts_subquery.c.playlist_id)
            .outerjoin(total_duration_subquery, Playlist.playlist_id == total_duration_subquery.c.playlist_id)
            .filter(Playlist.playlist_id == playlist_id, Playlist.user_id == user_id)
            .first()
        )

        # Response formatting
        if playlist:
            playlist_obj, song_count, total_duration = playlist
            data = {
                "playlist_id": playlist_obj.playlist_id,
                "title": playlist_obj.title,
                "description": playlist_obj.description,
                "thumbnail": playlist_obj.thumbnail,
                "privacy": playlist_obj.privacy,
                "created_at": playlist_obj.created_at.isoformat(),
                "song_count": song_count or 0,
                "total_duration": format_total_duration(int(total_duration or 0)),
                "duration": int(total_duration or 0)
            }
            return JSONResponse(content={"data": data}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.get("/get_public_playlist_details")
def get_public_playlist_details(request : Request, db: Session = Depends(get_db)):
    playlist_id = request.query_params.get("playlistId")

    if playlist_id:
        song_counts_subquery = (
                        db.query(
                            PlaylistSong.playlist_id,
                            func.count(PlaylistSong.id).label("song_count")
                        )
                        .group_by(PlaylistSong.playlist_id)
                        .subquery()
        )

        # Subquery: total duration
        total_duration_subquery = (
            db.query(
                PlaylistSong.playlist_id,
                func.sum(Songs.duration_seconds).label("total_duration")
            )
            .join(Songs, Songs.song_id == PlaylistSong.song_id)
            .group_by(PlaylistSong.playlist_id)
            .subquery()
        )

        # Main query with outer joins
        playlist = (
            db.query(
                Playlist,
                song_counts_subquery.c.song_count,
                total_duration_subquery.c.total_duration
            )
            .outerjoin(song_counts_subquery, Playlist.playlist_id == song_counts_subquery.c.playlist_id)
            .outerjoin(total_duration_subquery, Playlist.playlist_id == total_duration_subquery.c.playlist_id)
            .filter(Playlist.playlist_id == playlist_id)
            .first()
        )

        if not playlist:
            return JSONResponse(content={"message": "playlist not found"}, status_code=404)
        

        # Response formatting
        if playlist:
            playlist_obj, song_count, total_duration = playlist

            if playlist_obj.privacy == "private":
                return JSONResponse(content={"message": "this is a private playlist"}, status_code=401)
            data = {
                "playlist_id": playlist_obj.playlist_id,
                "title": playlist_obj.title,
                "description": playlist_obj.description,
                "thumbnail": playlist_obj.thumbnail,
                "privacy": playlist_obj.privacy,
                "created_at": playlist_obj.created_at.isoformat(),
                "song_count": song_count or 0,
                "total_duration": format_total_duration(int(total_duration or 0)),
                "duration": int(total_duration or 0)
            }
            return JSONResponse(content={"data": data}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.get("/get_public_playlist_songs")
def get_public_playlist_songs(request : Request, db: Session = Depends(get_db)):
        playlist_id = request.query_params.get("playlistId")
        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")

        if playlist_id:
            songs = db.query(PlaylistSong).filter(PlaylistSong.playlist_id == playlist_id).offset(offset).limit(limit).all()
            data = [
                {
                    "user_id": song.playlist.user_id,
                    "videoId": song.song.song_id,
                    "title": song.song.title,
                    "artists": song.song.artists,
                    "album": song.song.album,
                    "duration_seconds": song.song.duration_seconds,
                    "thumbnail": song.song.thumbnail,
                    "created_at": song.created_at.isoformat()
                } for song in songs
            ]
            # print(vars(songs[0].song))
            return JSONResponse(content={"data": {"songs": data}}, status_code=200)

@router.get("/get_playlist_songs")
def get_playlist_songs(request : Request, db: Session = Depends(get_db)):
    user_id = request.state.user_id
    if user_id:
        playlist_id = request.query_params.get("playlistId")
        limit = request.query_params.get("limit")
        offset = request.query_params.get("offset")
        if playlist_id:
            songs = db.query(PlaylistSong).filter(PlaylistSong.playlist_id == playlist_id).offset(offset).limit(limit).all()
            data = [
                {
                    "user_id": song.playlist.user_id,
                    "videoId": song.song.song_id,
                    "title": song.song.title,
                    "artists": song.song.artists,
                    "album": song.song.album,
                    "duration_seconds": song.song.duration_seconds,
                    "thumbnail": song.song.thumbnail,
                    "created_at": song.created_at.isoformat()
                } for song in songs
            ]
            # print(vars(songs[0].song))
            return JSONResponse(content={"data": {"songs": data}}, status_code=200)
    else:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=401)

@router.post("/add_to_playlist")
async def add_to_playlist(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    user_id = request.state.user_id

    if not user_id:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)

    video_id = data["videoId"]
    playlist_id = data["playlistId"]

    # Check if the song is already in the playlist
    existing_entry = db.query(PlaylistSong).filter(
        PlaylistSong.playlist_id == playlist_id,
        PlaylistSong.song_id == video_id
    ).first()

    if existing_entry:
        return JSONResponse(content={"message": "song already exists in playlist"}, status_code=400)

    # Ensure song exists in Songs table
    song = db.query(Songs).filter(Songs.song_id == video_id).first()
    if not song:
        new_song = Songs(
            song_id=video_id,
            title=data["title"],
            artists=", ".join(artist["name"] for artist in data["artists"]),
            album= data.get("album") or None,
            duration_seconds=data.get("duration_seconds"),
            thumbnail=(data.get("thumbnails")[0]["url"] if data.get("thumbnails") else None),
        )
        db.add(new_song)
        db.flush()

    # Insert into playlist_songs
    playlist_song = PlaylistSong(
        playlist_id=playlist_id,
        song_id=video_id
    )
    db.add(playlist_song)
    db.commit()

    return JSONResponse(content={"message": "song added to playlist"}, status_code=200)

@router.post("/batch_add_to_playlist")
async def batch_add_to_playlist(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    user_id = request.state.user_id

    if not user_id:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)
    
    playlist_id = data["playlistId"]
    songs = data["songs"]

    video_ids = [song["videoId"] for song in songs]

    existing_songs_ids = set(
        r[0] for r in db.execute(
            select(Songs.song_id).where(Songs.song_id.in_(video_ids))
        ).all()
    )

    existing_playlist_song_ids = set(
        r[0] for r in db.execute(
            select(PlaylistSong.song_id).where(PlaylistSong.song_id.in_(video_ids), PlaylistSong.playlist_id == playlist_id)
        ).all()
    )

    print(existing_playlist_song_ids)

    songs_to_add = [
        Songs(
            song_id=song["videoId"],
            title=song["title"],
            artists=", ".join(artist["name"] for artist in song["artists"]),
            album= None,
            duration_seconds=song.get("duration_seconds"),
            thumbnail=(song.get("thumbnails")[0]["url"] if song.get("thumbnails") else None),
        ) for song in songs if song["videoId"] not in existing_songs_ids
    ]
    if songs_to_add:
        db.bulk_save_objects(songs_to_add)
        db.commit()

    playlist_songs_to_add = [
        PlaylistSong(
            playlist_id=playlist_id,
            song_id=song["videoId"]
        ) for song in songs if song["videoId"] not in existing_playlist_song_ids
    ]

    if playlist_songs_to_add:
        db.bulk_save_objects(playlist_songs_to_add)
        db.commit()

    return JSONResponse(content={"message": "song added to playlist"}, status_code=200)

@router.delete("/remove_from_playlist")
async def remove_from_playlist(request: Request, db: Session = Depends(get_db)):
    song_id = request.query_params.get("songId")
    playlist_id = request.query_params.get("playlistId")
    user_id = request.state.user_id

    if not user_id:
        return JSONResponse(content={"message": "invalid credentials"}, status_code=400)

    existing_playlist_song_ids = set(
        r[0] for r in db.execute(
            select(PlaylistSong.song_id).where(PlaylistSong.song_id == song_id, PlaylistSong.playlist_id == playlist_id)
        ).all()
    )

    if existing_playlist_song_ids:
        db.query(PlaylistSong).filter(PlaylistSong.song_id == song_id, PlaylistSong.playlist_id == playlist_id).delete()
        db.commit()

    return JSONResponse(content={"message": "song removed from playlist"}, status_code=200)