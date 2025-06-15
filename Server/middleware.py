from fastapi import Request, FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

class AuthMiddleWare(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        token = request.cookies.get("access_token")
        if token:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("id")
                request.state.user_id = user_id
            
            except jwt.ExpiredSignatureError:
                request.state.user_id = None
            except jwt.InvalidTokenError:
                request.state.user_id = None
        
        else:
            request.state.user_id = None
        
        response = await call_next(request)
        return response