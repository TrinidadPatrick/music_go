from fastapi import FastAPI, Request, APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi.responses import RedirectResponse, HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from requests_oauthlib import OAuth2Session
import os
from dotenv import load_dotenv
import jwt
import datetime
from db import get_db
from models import User
from Schemas.user import UserCreate
from passlib.context import CryptContext
import urllib.parse

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

AUTHORIZATION_BASE_URL = 'https://accounts.google.com/o/oauth2/auth'
TOKEN_URL = 'https://oauth2.googleapis.com/token'
USER_INFO_URL = 'https://www.googleapis.com/oauth2/v1/userinfo'

SCOPE = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']

def generate_token(payload):
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return token

############################################################################################################################

# Registers the user
def create_user(db: Session, user_in: UserCreate):
    user = User(
        email = user_in.email,
        name = user_in.name,
        profile_image = user_in.profile_image,
        password_hash = user_in.password_hash,
        google_id = user_in.google_id,
        auth_provider = user_in.auth_provider
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

############################################################################################################################

# Get user information
@router.get("/me")
def get_user_info(request: Request, db: Session = Depends(get_db)):
     user_id = request.state.user_id
     if user_id:
          user = db.query(User).filter(User.id == user_id).first()

          if user:
               data = {
               "name" : user.name,
               "email" : user.email,
               "profile_image" : user.profile_image
               }
               response = JSONResponse(content={"user" : data }, status_code=200)
               return response
          else:
            return JSONResponse(content={"user" : {} }, status_code=401)

     else:
        return JSONResponse(content={"user" : {} }, status_code=401)

#    print(request.cookies.get("access_token"))

# Login Manually
@router.post("/auth/login")
async def login(req: Request, db: Session = Depends(get_db)):
    data = await req.json()
    
    user = db.query(User).filter(func.lower(User.email) == data["email"].lower(), User.auth_provider == "local").first()
    
    if user:
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        is_valid = pwd_context.verify(data["password"], user.password_hash)
        if is_valid:
                token = generate_token({"id" : user.id, 
                                "iat" : datetime.datetime.utcnow(), 
                                "exp" : datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                               })
                response = JSONResponse(content={"message": "Registered"}, status_code=200)
                response.set_cookie("access_token", token, httponly=True, secure=True, samesite='None')
                return response
        else:
            return JSONResponse(content={"message" : "Email or password is incorrect"}, status_code=401)
    else:
        return JSONResponse(content={"message" : "Email or password is incorrect"}, status_code=401)

############################################################################################################################
    
# Register the user manually
@router.post("/auth/register")
async def login(req: Request, db: Session = Depends(get_db)):
    data = await req.json()

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    user = db.query(User).filter(func.lower(User.email) == data["email"].lower()).first()
    
    if user:
        return JSONResponse(content={"message" : "Email is already registerd to an account"}, status_code=409)
    else:
        email = data["email"]
        name = data["name"]
        password_hash = pwd_context.hash(data["password"])
        user_in = UserCreate(email=email, name=name, google_id="", password_hash=password_hash, auth_provider="local", profile_image="")
        user_created = create_user(db, user_in)

        token = generate_token({"id" : user_created.id, 
                                "iat" : datetime.datetime.utcnow(), 
                                "exp" : datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                               })
        response = JSONResponse(content={"message": "Registered"}, status_code=200)
        response.set_cookie("access_token", token, httponly=True, secure=True, samesite=None)
        return response
    
############################################################################################################################

@router.get("/auth/login/google")
async def login(request: Request, provider: str, state: str):
    if(provider == "google"):
        google = OAuth2Session(CLIENT_ID, scope=SCOPE, redirect_uri=REDIRECT_URI)
        authorization_url, state = google.authorization_url(AUTHORIZATION_BASE_URL,state=state, access_type='offline', prompt='select_account')

        request.session['oauth_state'] = state
        return RedirectResponse(authorization_url)
    
############################################################################################################################


@router.get("/auth/callback")
async def callback(request: Request, state: str, db: Session = Depends(get_db)):
    google = OAuth2Session(CLIENT_ID, state=request.session.get('oauth_state'), redirect_uri=REDIRECT_URI)
    token = google.fetch_token(TOKEN_URL, client_secret=CLIENT_SECRET, authorization_response=str(request.url))

    request.session['oauth_token'] = token

    resp = google.get(USER_INFO_URL)
    user_info = resp.json()

    email = user_info["email"]
    name = user_info["name"]
    profile_image = user_info.get("picture")
    google_id = user_info["id"]

    # Finding if the user exist in the DB
    user_data = db.query(User).filter(User.email == user_info.get("email")).first()

    # If user is already registered manually
    if user_data and user_data.auth_provider == "local":
            message = "Email is already registered to a local account"
            encoded_message = urllib.parse.quote(message)
            redirect_url = f"http://localhost:5173/{state}?message={encoded_message}"
            return RedirectResponse(url=redirect_url)

    # If not exist in DB
    if not user_data:
        user_in = UserCreate(email=email, name=name, google_id=google_id, password_hash="", auth_provider="google", profile_image=profile_image)
        user_created = create_user(db, user_in=user_in)
    
    token = generate_token({
        "id" : user_data.id if user_data else user_created.id,
        "iat" : datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    })
    response = RedirectResponse("http://localhost:5173/")
    response.set_cookie("access_token", token, httponly=True, secure=True, samesite="none")
    return response

    # Save user to DB here if needed
    # return HTMLResponse(f"<h1>User info:</h1><pre>{user_info}</pre>")

############################################################################################################################

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users