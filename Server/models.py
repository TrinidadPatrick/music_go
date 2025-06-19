from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func, Text
from sqlalchemy.orm import relationship
from db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    profile_image = Column(String(255), nullable=True)
    google_id = Column(String(255), nullable=True)
    auth_provider = Column(String(255), default="local")
    password_hash = Column(String(255), nullable=True)

    playlists = relationship("Playlist", back_populates="user")
    

class Songs(Base):
    __tablename__ = "songs"

    song_id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    artists = Column(String(255), nullable=False)
    album = Column(String(255), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    thumbnail = Column(String(255), nullable=True)

    libraries = relationship("Library", back_populates="song", cascade="all, delete-orphan")

    playlists = relationship("PlaylistSong", back_populates="song", cascade="all, delete-orphan")

class Library(Base):
    __tablename__ = "user_library"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    song_id = Column(String(100), ForeignKey("songs.song_id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, default=func.now())
    song = relationship("Songs", back_populates="libraries")

class Playlist(Base):
    __tablename__ = 'playlists'

    playlist_id = Column(String(100), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    thumbnail = Column(Text)
    privacy = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    songs = relationship("PlaylistSong", back_populates="playlist")
    user = relationship("User", back_populates="playlists")

class PlaylistSong(Base):
    __tablename__ = 'playlist_songs'

    id = Column(Integer, primary_key=True)
    playlist_id = Column(String(100), ForeignKey('playlists.playlist_id', ondelete='CASCADE'), nullable=False)
    song_id = Column(String(100), ForeignKey('songs.song_id', ondelete='CASCADE'), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    playlist = relationship("Playlist", back_populates="songs")

    song = relationship("Songs", back_populates="playlists")