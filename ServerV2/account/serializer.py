from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import User, Playlist

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ["playlist_id", "title", "description", "thumbnail", "privacy", "created_at"]

class UserSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(many=True, read_only=True, source="playlist_set")

    class Meta:
        model = User
        fields = ["id", "name", "email", "profile_image", "playlists"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["name", "email", "password", "profile_image"]

    def create(self, validated_data):
        return User.objects.create(
            name=validated_data["name"],
            email=validated_data["email"],
            profile_image=validated_data.get("profile_image", ""),
            google_id="",
            auth_provider="local",
            password_hash=make_password(validated_data["password"]),
        )
