# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
import os
from Routes.music_routes import router as music_router
from Routes.user_routes import router as user_router
from Routes.auth_music_routes import router as auth_music_router
from middleware import AuthMiddleWare

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://music-go.vercel.app",
    "https://music-go.vercel.app/",
    "http://192.168.100.31:5173"
]

# Add session middleware first
app.add_middleware(SessionMiddleware, secret_key=os.urandom(24))

# Custom auth middleware
app.add_middleware(AuthMiddleWare)

# CORS middleware
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
app.include_router(auth_music_router, prefix="/auth/music")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
