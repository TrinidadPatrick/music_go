from django.db import models

# Create your models here.
class User(models.Model):

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=False, null=False)
    profile_image = models.CharField(max_length=255, blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)
    auth_provider = models.CharField(max_length=255, blank=False, null=False, default='local')
    password_hash =models.CharField(null=True, max_length=255)

    class Meta:
        db_table = 'users'

class Songs(models.Model):

    song_id = models.CharField(max_length=255, primary_key=True, db_index=True)
    title = models.CharField(max_length=255, null=False, blank=False)
    artists = models.CharField(max_length=255, null=True, blank=True)
    album = models.CharField(max_length=255, null=True, blank=True)
    duration_seconds = models.PositiveSmallIntegerField(null=True)
    thumbnail = models.CharField(max_length=255, null=True, blank=True)

    def delete(self, *args, **kwargs):
        raise Exception("Songs cannot be deleted.")

    class Meta:
        db_table = 'songs'

class Library(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    song = models.ForeignKey(Songs, on_delete=models.CASCADE,  db_column='song_id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_library'
        unique_together = ('user', 'song')

class Playlist(models.Model):
    PRIVACY_CHOICES = [
    ('private', 'Private'),
    ('public', 'Public'),
]

    playlist_id = models.CharField(max_length=255, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.CharField(max_length=500, null=False, blank=False)
    thumbnail = models.CharField(max_length=255, null=True, blank=True)
    privacy = models.CharField(max_length=20, choices=PRIVACY_CHOICES, null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'playlists'


class PlaylistSong(models.Model):

    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, null=False,  db_column='playlist_id')
    song = models.ForeignKey(Songs, on_delete=models.PROTECT, null=False, db_column='song_id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'playlist_songs'

