from sqlalchemy import Column, Integer, String
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