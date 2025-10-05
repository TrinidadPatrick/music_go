@echo off
set IMAGE_NAME=music_go_server
set USERNAME=patrick849
set TAG=latest

echo 🚀 Building Docker image...
docker build -t %IMAGE_NAME% .

echo 🏷️ Tagging image as %USERNAME%/%IMAGE_NAME%:%TAG%
docker tag %IMAGE_NAME% %USERNAME%/%IMAGE_NAME%:%TAG%

echo 🔐 Logging in to Docker Hub...
docker login

echo ⬆️ Pushing image to Docker Hub...
docker push %USERNAME%/%IMAGE_NAME%:%TAG%

echo ✅ Done! Image pushed successfully to Docker Hub.
pause