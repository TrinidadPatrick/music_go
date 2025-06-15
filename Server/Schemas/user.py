# schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: str
    name: str
    profile_image: Optional[str]
    google_id: Optional[str] = None
    password_hash: Optional[str] = None
    auth_provider: str = "local"

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    name: Optional[str] = None
    auth_provider: str
    google_id: str

    class Config:
        orm_mode = True
