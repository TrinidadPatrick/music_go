# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from Routes.music_routes import router as music_router
from Routes.user_routes import router as user_router
from middleware import AuthMiddleWare

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://music-go.vercel.app",
]

# Add SessionMiddleware first
app.add_middleware(SessionMiddleware, secret_key=os.urandom(24))

app.add_middleware(AuthMiddleWare)

# Then add CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "YTMusic API is running"}

# Register routers
app.include_router(music_router, prefix="/music")
app.include_router(user_router, prefix="/user")
