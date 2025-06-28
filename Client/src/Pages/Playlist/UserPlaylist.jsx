import React, { useEffect, useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Clock, Search, Plus, Shuffle, Download, Share2, ArrowLeft, Music, X, Upload, Globe, Lock, Image, Library } from 'lucide-react';
import Modal from 'react-modal';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UserPlaylist = () => {
  const navigate = useNavigate()
  const getUserPlaylists = useUserPlaylistStore( state => state.getUserPlaylists)
  const userPlaylist = useUserPlaylistStore( state => state.userPlaylist)
  const createPlaylist = useUserPlaylistStore( state => state.createPlaylist)
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

  const openPlaylist = (playlist) => {
    navigate(`/user/playlist/detail?playlistId=${playlist.playlist_id}`)
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
    <div className="h-full p-8">

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Your Playlists</h1>
        <p className="text-gray-400">Manage and play your music collections</p>
      </div>

      {/* Create New Playlist */}
      <div className="mb-8">
        <button onClick={()=>setModalIsOpen(true)} className="flex items-center p-4 space-x-3 transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-600 rounded-lg">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-left">
            <p className="font-medium text-white">Create Playlist</p>
            <p className="text-sm text-gray-400">Start building your perfect mix</p>
          </div>
        </button>
      </div>

      {/* Recently Created */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Recently Created</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPlaylist?.playlists?.slice(0, 3).map((playlist) => {
            const parts = playlist?.total_duration.split(" ");
            const duration =
              parts[0] + " " + parts[1].slice(0, 3) + " " +
              parts[3] + " " + parts[4].slice(0, 3);

            return (
            <div 
              key={playlist.playlist_id}
              onClick={() => openPlaylist(playlist)}
              className="p-6 transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 group"
            >
              <div className={`w-full h-48  rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className="text-4xl text-white">♪</div>
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-opacity-0 bg-gradient-to-br from-purple-600 to-pink-600 group-hover:bg-opacity-30">
                  <Library className="absolute w-12 h-12 text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-100 top-1/2 left-1/2 group-hover:opacity-0" />
                  <Play className="absolute w-12 h-12 text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-0 top-1/2 left-1/2 group-hover:opacity-100" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-white">{playlist?.title}</h3>
              <p className="mb-2 text-sm text-gray-400 line-clamp-2">{playlist?.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{playlist?.song_count} songs • {duration}</span>
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
        <h2 className="mb-4 text-2xl font-bold">All Playlists</h2>
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
              className="flex flex-col items-center p-4 space-x-4 transition-colors rounded-lg cursor-pointer hover:bg-gray-800 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${''} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                <div className="text-xl text-white">♪</div>
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-opacity-0 bg-gradient-to-br from-purple-600 to-pink-600 group-hover:bg-opacity-50">
                  <Library className="absolute text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-100 top-1/2 left-1/2 w-7 h-7 group-hover:opacity-0" />
                  <Play className="absolute text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-0 top-1/2 left-1/2 w-7 h-7 group-hover:opacity-100" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{playlist?.title}</h3>
                <p className="text-sm text-gray-400">{playlist?.description}</p>
                <p className="mt-1 text-xs text-gray-500">{playlist?.song_count} songs • {duration} • Created {dateAdded}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded ${playlist.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {playlist?.privacy.toUpperCase()}
                </span>
                <button className="text-gray-400 transition-all opacity-0 group-hover:opacity-100 hover:text-white">
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

  useEffect(()=>{
    getUserPlaylists()
  }, [])

  Modal.setAppElement('#root');
  return (
    <div className="flex w-full h-full overflow-hidden text-white ">
      
      {/* Add PlaylistModal */}
      <Modal isOpen={modalIsOpen} style={modalStyle} onRequestClose={() => setModalIsOpen(false)}>
          <div className="bg-slate-800 rounded-2xl w-[350px] border border-slate-700 shadow-2xl transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Music size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Create New Playlist</h2>
              </div>
              <button 
                onClick={() => setModalIsOpen(false)}
                className="p-1 transition-colors rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700"
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
                      className="object-cover w-24 h-24 border-2 rounded-xl border-slate-600"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed bg-slate-700 rounded-xl border-slate-600">
                      <Image size={24} className="text-slate-400" />
                    </div>
                  )}
                  <label className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-blue-600 rounded-full cursor-pointer -bottom-2 -right-2 hover:bg-blue-700">
                    <Upload size={14} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-sm text-slate-400">Add a cover image</p>
              </div>

              {/* Playlist Name */}
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="w-full px-3 py-2 text-sm text-white transition-all border rounded-lg bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm text-white transition-all border rounded-lg resize-none bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between gap-5 p-4 border rounded-lg bg-slate-900 border-slate-600">
                <div className="flex items-center space-x-3">
                  {isPrivate ? (
                    <Lock size={20} className="text-slate-400" />
                  ) : (
                    <Globe size={20} className="text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isPrivate ? 'Private' : 'Public'}
                    </p>
                    <p className="text-xs text-slate-400">
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
              <div className="flex pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!playlistName.trim()}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg whitespace-nowrap hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Playlist
                </button>
              </div>
            </div>
          </div>
      </Modal>

      {/* Render current view */}
      <div className="flex flex-col flex-1 h-full overflow-auto">
      <PlaylistOverview />
      </div>
      <Toaster position='bottom-right' />
    </div>
  );
};

export default UserPlaylist;