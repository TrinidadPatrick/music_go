import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Clock, Search, Plus, Shuffle, Download, Share2, ArrowLeft, Music, X, Upload, Globe, Lock, Image, Library } from 'lucide-react';
import Modal from 'react-modal';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';
import { Toaster, toast } from 'react-hot-toast';

const UserPlaylist = () => {
  const getUserPlaylists = useUserPlaylistStore( state => state.getUserPlaylists)
  const userPlaylist = useUserPlaylistStore( state => state.userPlaylist)
  const createPlaylist = useUserPlaylistStore( state => state.createPlaylist)
  const [currentView, setCurrentView] = useState('overview'); // 'overview' or 'playlist'
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set([1, 3, 7]));
  const [currentTrack, setCurrentTrack] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  const notify = (message) => toast.success(message);

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '99999999',
      padding: '0',
      backgroundColor: 'transparent',
      border: 'none',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }
  };

  const playlists = [
    {
      id: 1,
      name: "My Playlist #1",
      description: "A collection of my favorite songs for every mood",
      songs: 15,
      duration: "1 hr 8 min",
      dateCreated: "3 days ago",
      isPublic: true,
      coverColor: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      name: "Chill Vibes",
      description: "Relaxing tunes for peaceful moments",
      songs: 28,
      duration: "2 hr 15 min",
      dateCreated: "1 week ago",
      isPublic: false,
      coverColor: "from-blue-600 to-cyan-600"
    },
    {
      id: 3,
      name: "Workout Mix",
      description: "High energy tracks to pump you up",
      songs: 22,
      duration: "1 hr 35 min",
      dateCreated: "2 weeks ago",
      isPublic: true,
      coverColor: "from-red-600 to-orange-600"
    },
    {
      id: 4,
      name: "Late Night",
      description: "Smooth sounds for after dark",
      songs: 18,
      duration: "1 hr 22 min",
      dateCreated: "3 weeks ago",
      isPublic: false,
      coverColor: "from-indigo-600 to-purple-600"
    },
    {
      id: 5,
      name: "Road Trip",
      description: "Perfect songs for long drives",
      songs: 35,
      duration: "2 hr 48 min",
      dateCreated: "1 month ago",
      isPublic: true,
      coverColor: "from-green-600 to-teal-600"
    },
    {
      id: 6,
      name: "Throwback Hits",
      description: "Nostalgic favorites from the past",
      songs: 42,
      duration: "3 hr 12 min",
      dateCreated: "1 month ago",
      isPublic: true,
      coverColor: "from-yellow-600 to-orange-600"
    }
  ];

  const songs = [
    { id: 1, title: "Thinking out Loud", artist: "Ed Sheeran", album: "X (Multiply)", duration: "4:50", dateAdded: "3 days ago" },
    { id: 2, title: "Let Her Go (Live from The Factory Theatre, Sydney)", artist: "Passenger", album: "Live from The Factory Theatre", duration: "4:15", dateAdded: "3 days ago" },
    { id: 3, title: "A Thousand Years", artist: "Christina Perri", album: "The Twilight Saga: Breaking Dawn", duration: "4:48", dateAdded: "3 days ago" },
    { id: 4, title: "Rule the World", artist: "Take That", album: "Beautiful World", duration: "4:29", dateAdded: "3 days ago" },
    { id: 5, title: "Perfect", artist: "Ed Sheeran", album: "÷ (Divide)", duration: "4:23", dateAdded: "1 week ago" },
    { id: 6, title: "Someone Like You", artist: "Adele", album: "21", duration: "4:45", dateAdded: "1 week ago" },
    { id: 7, title: "Say Something", artist: "A Great Big World, Christina Aguilera", album: "Is There Anybody Out There?", duration: "3:52", dateAdded: "2 weeks ago" },
    { id: 8, title: "All of Me", artist: "John Legend", album: "Love in the Future", duration: "4:29", dateAdded: "2 weeks ago" },
    { id: 9, title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour", duration: "2:52", dateAdded: "3 weeks ago" },
    { id: 10, title: "Counting Stars", artist: "OneRepublic", album: "Native", duration: "4:17", dateAdded: "3 weeks ago" }
  ];

  const openPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentView('playlist');
  };

  const backToOverview = () => {
    setCurrentView('overview');
    setSelectedPlaylist(null);
  };

  const toggleLike = (songId) => {
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songId)) {
      newLikedSongs.delete(songId);
    } else {
      newLikedSongs.add(songId);
    }
    setLikedSongs(newLikedSongs);
  };

  const playTrack = (songId) => {
    if (currentTrack === songId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(songId);
      setIsPlaying(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (playlistName.trim()) {
        const data = {
            title: playlistName,
            description: description,
            thumbnail: coverImage,
            privacy: isPrivate ? 'private' : 'public'
        }
    
        const result = await createPlaylist(data, notify)
        console.log(data)
    }
    }

  const PlaylistOverview = () => (
    <div className="p-8 h-full">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Playlists</h1>
        <p className="text-gray-400">Manage and play your music collections</p>
      </div>

      {/* Create New Playlist */}
      <div className="mb-8">
        <button onClick={()=>setModalIsOpen(true)} className=" cursor-pointer flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors">
          <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-medium">Create Playlist</p>
            <p className="text-gray-400 text-sm">Start building your perfect mix</p>
          </div>
        </button>
      </div>

      {/* Recently Created */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recently Created</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPlaylist?.playlists?.slice(0, 3).map((playlist) => {
            const parts = playlist?.total_duration.split(" ");
            const duration =
              parts[0] + " " + parts[1].slice(0, 3) + " " +
              parts[3] + " " + parts[4].slice(0, 3);

            return (
            <div 
              key={playlist.playlist_id}
              onClick={() => openPlaylist(playlist)}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
            >
              <div className={`w-full h-48  rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="text-4xl text-white">♪</div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <Library className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  <Play className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">{playlist?.title}</h3>
              <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist?.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">{playlist?.song_count} songs • {duration}</span>
                <span className={`text-xs px-2 py-1 rounded ${playlist.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {playlist?.privacy.toUpperCase()}
                </span>
              </div>
            </div>
          )})}
        </div>
      </div>

      {/* All Playlists */}
      <div>
        <h2 className="text-2xl font-bold mb-4">All Playlists</h2>
        <div className="space-y-3">
          {userPlaylist?.playlists?.map((playlist) => {
            const now = new Date();
            const createdAt = new Date(playlist?.created_at);
            const diffMs = now - createdAt;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const dateAdded =
                diffDays > 0
                ? `${diffDays} days ago`
                : diffHours > 0
                ? `${diffHours} hours ago`
                : diffMins > 0
                ? `${diffMins} minutes ago`
                : "a few seconds ago";
            const parts = playlist?.total_duration.split(" ");
            const duration =
              parts[0] + " " + parts[1].slice(0, 3) + " " +
              parts[3] + " " + parts[4].slice(0, 3);

            return (
            <div 
              key={playlist.playlist_id}
              onClick={() => openPlaylist(playlist)}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${''} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                <div className="text-xl text-white">♪</div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <Library className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-white opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  <Play className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{playlist?.title}</h3>
                <p className="text-gray-400 text-sm">{playlist?.description}</p>
                <p className="text-gray-500 text-xs mt-1">{playlist?.song_count} songs • {duration} • Created {dateAdded}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded ${playlist.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {playlist?.privacy.toUpperCase()}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          )})}
        </div>
      </div>

      <div className="h-32"></div>
    </div>
  );

  const PlaylistDetail = () => (
    <div className="ml-64 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={backToOverview}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for songs, artists..." 
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Playlist Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-lg p-8 mb-8">
        <div className="flex items-end space-x-6">
          <div className={`w-64 h-64 bg-gradient-to-br ${selectedPlaylist?.coverColor} rounded-lg shadow-2xl flex items-center justify-center`}>
            <div className="text-6xl text-white">♪</div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-300 mb-2">{selectedPlaylist?.isPublic ? 'PUBLIC' : 'PRIVATE'} PLAYLIST</p>
            <h1 className="text-6xl font-bold mb-4">{selectedPlaylist?.name}</h1>
            <p className="text-gray-300 mb-4 max-w-lg">{selectedPlaylist?.description}</p>
            <div className="flex items-center space-x-1 text-sm text-gray-300">
              <span className="font-medium">Created by You</span>
              <span>•</span>
              <span>{selectedPlaylist?.songs} songs,</span>
              <span className="text-gray-400">{selectedPlaylist?.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-8">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors hover:scale-105"
        >
          {isPlaying ? <Pause className="w-6 h-6 text-black" /> : <Play className="w-6 h-6 text-black ml-1" />}
        </button>
        <button className="w-8 h-8 text-gray-400 hover:text-white hover:scale-110 transition-all">
          <Shuffle className="w-6 h-6" />
        </button>
        <button className="w-8 h-8 text-gray-400 hover:text-white hover:scale-110 transition-all">
          <Download className="w-6 h-6" />
        </button>
        <button className="w-8 h-8 text-gray-400 hover:text-white hover:scale-110 transition-all">
          <Share2 className="w-6 h-6" />
        </button>
        <button className="w-8 h-8 text-gray-400 hover:text-white hover:scale-110 transition-all">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* Song List Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-4">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">TITLE</div>
        <div className="col-span-3">ALBUM</div>
        <div className="col-span-2">DATE ADDED</div>
        <div className="col-span-1 text-center">
          <Clock className="w-4 h-4 mx-auto" />
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-2">
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group ${
              currentTrack === song.id ? 'bg-gray-800' : ''
            }`}
          >
            <div className="col-span-1 flex items-center justify-center">
              <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
              <button 
                onClick={() => playTrack(song.id)}
                className="hidden group-hover:block text-white hover:scale-110 transition-transform"
              >
                {currentTrack === song.id && isPlaying ? 
                  <Pause className="w-4 h-4" /> : 
                  <Play className="w-4 h-4" />
                }
              </button>
            </div>
            
            <div className="col-span-5 flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded"></div>
              <div>
                <p className={`font-medium ${currentTrack === song.id ? 'text-green-500' : 'text-white'}`}>
                  {song.title}
                </p>
                <p className="text-gray-400 text-sm">{song.artist}</p>
              </div>
            </div>
            
            <div className="col-span-3 flex items-center">
              <p className="text-gray-400 text-sm truncate">{song.album}</p>
            </div>
            
            <div className="col-span-2 flex items-center">
              <p className="text-gray-400 text-sm">{song.dateAdded}</p>
            </div>
            
            <div className="col-span-1 flex items-center justify-center space-x-2">
              <button 
                onClick={() => toggleLike(song.id)}
                className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                  likedSongs.has(song.id) ? 'text-green-500 opacity-100' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedSongs.has(song.id) ? 'fill-current' : ''}`} />
              </button>
              <span className="text-gray-400 text-sm">{song.duration}</span>
              <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-32"></div>
    </div>
  );

  useEffect(()=>{
    getUserPlaylists()
  }, [])

  Modal.setAppElement('#root');
  return (
    <div className=" text-white h-full w-full overflow-hidden flex">
      
      {/* Add PlaylistModal */}
      <Modal isOpen={modalIsOpen} style={modalStyle} onRequestClose={() => setModalIsOpen(false)}>
          <div className="bg-slate-800 rounded-2xl w-[350px] border border-slate-700 shadow-2xl transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Music size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Create New Playlist</h2>
              </div>
              <button 
                onClick={() => setModalIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 space-y-6">
              {/* Cover Image Upload */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt="Playlist cover" 
                      className="w-24 h-24 rounded-xl object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600">
                      <Image size={24} className="text-slate-400" />
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                    <Upload size={14} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-slate-400 text-sm">Add a cover image</p>
              </div>

              {/* Playlist Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                  className="w-full text-sm px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between gap-5 p-4 bg-slate-900 rounded-lg border border-slate-600">
                <div className="flex items-center space-x-3">
                  {isPrivate ? (
                    <Lock size={20} className="text-slate-400" />
                  ) : (
                    <Globe size={20} className="text-slate-400" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">
                      {isPrivate ? 'Private' : 'Public'}
                    </p>
                    <p className="text-slate-400 text-xs">
                      {isPrivate ? 'Only you can see this playlist' : 'Anyone can see this playlist'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    isPrivate ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                  className="flex-1 px-3 py-2 text-slate-300 border text-sm border-slate-600 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!playlistName.trim()}
                  className=" whitespace-nowrap flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Create Playlist
                </button>
              </div>
            </div>
          </div>
      </Modal>

      {/* Render current view */}
      <div className="flex-1 h-full overflow-auto flex flex-col">
      {currentView === 'overview' ? <PlaylistOverview /> : <PlaylistDetail />}
      </div>
      <Toaster position='bottom-right' />
    </div>
  );
};

export default UserPlaylist;