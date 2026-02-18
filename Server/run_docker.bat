@echo off
set IMAGE_NAME=music_go_server

echo Building Docker image...
docker build -t %IMAGE_NAME% .


echo Running docker image...
docker run -d -p 8000:8000 --env-file .env --name music-server music_go_server