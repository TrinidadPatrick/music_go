@echo off
echo Starting server...
uvicorn main:app --reload
pause