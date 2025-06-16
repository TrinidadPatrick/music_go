from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
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

class Songs(Base):
    __tablename__ = "songs"

    song_id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    artists = Column(String(255), nullable=False)
    album = Column(String(255), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    thumbnail = Column(String(255), nullable=True)
    libraries = relationship("Library", back_populates="song", cascade="all, delete-orphan")

class Library(Base):
    __tablename__ = "user_library"
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    song_id = Column(String(100), ForeignKey("songs.song_id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(TIMESTAMP, default=func.now())
    song = relationship("Songs", back_populates="libraries")