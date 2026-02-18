@echo off
echo Starting server...
.\venv\Scripts\activate
uvicorn main:app --reload
pause