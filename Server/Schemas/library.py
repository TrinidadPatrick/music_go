from pydantic import BaseModel
from datetime import datetime
from Schemas.song import SongOut  # import correctly

class LibraryOut(BaseModel):
    user_id: int
    created_at: datetime
    song: SongOut  # nested Pydantic model

    class Config:
        orm_mode = True
