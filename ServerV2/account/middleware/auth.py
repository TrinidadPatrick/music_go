import jwt
import os
from django.utils.deprecation import MiddlewareMixin
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"

class AuthMiddleware(MiddlewareMixin):
    
    def process_request(self, request):
        token = request.COOKIES.get("access_token")

        if token:
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
                user_id = payload.get("id")
                # Attach user_id to request (similar to request.state in FastAPI)
                request.user_id = user_id  

            except jwt.ExpiredSignatureError:
                request.user_id = None
            except jwt.InvalidTokenError:
                request.user_id = None
        else:
            request.user_id = None
