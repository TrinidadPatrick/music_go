from pydantic import BaseModel
from typing import Optional

class SongOut(BaseModel):
    song_id: str
    title: str
    artists: str
    album: Optional[str]
    duration_seconds: Optional[int]
    thumbnail: Optional[str]

    class Config:
        orm_mode = True
