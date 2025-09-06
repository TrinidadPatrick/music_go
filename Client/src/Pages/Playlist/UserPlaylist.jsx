import React, { useCallback, useEffect, useState } from 'react';
import { Play, MoreHorizontal, Plus, Music, X, Upload, Globe, Lock, Image, Library, Edit, Share2, Delete, Trash } from 'lucide-react';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog"
import { Button } from "@/Components/ui/button"
import PlaylistModal from './PlaylistModal';

const UserPlaylist = () => {
  const navigate = useNavigate()
  const getUserPlaylists = useUserPlaylistStore( state => state.getUserPlaylists)
  const userPlaylist = useUserPlaylistStore( state => state.userPlaylist)
  const createPlaylist = useUserPlaylistStore( state => state.createPlaylist)
  const updatePlaylist = useUserPlaylistStore( state => state.updatePlaylist)
  const deletePlaylist = useUserPlaylistStore( state => state.deletePlaylist)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [playlistId, setPlaylistId] = useState(null)
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false)

  const notify = (message) => toast.success(message);

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

  const handleEditPlaylist = (playlist) => {
    if(playlist){
      setPlaylistId(playlist.playlist_id)
      setPlaylistName(playlist.title)
      setDescription(playlist.description)
      setIsPrivate(playlist.privacy === 'private')
      setModalIsOpen(true)
    }
  }

  const handleSubmit = async () => {
    if (playlistName.trim()) {
        const data = {
            title: playlistName,
            description: description,
            thumbnail: coverImage,
            privacy: isPrivate ? 'private' : 'public'
        }
        
        if(playlistId){
          const result = await updatePlaylist(playlistId, data, notify)
          setModalIsOpen(false)
          return
        }
        const result = await createPlaylist(data, notify)
        setModalIsOpen(false)
        
        
    }
  }

  const NoPlaylist = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-8">
        <h1 className="mb-2 text-4xl font-bold ">No Playlists</h1>
        <p className="text-gray-400">You haven't created any playlists yet</p>
      </div>
    )
  }

  const PlaylistDropdown = ({playlist}) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent hover:bg-gray-700">
          <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start" side="right">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={(e)=>{e.stopPropagation();handleEditPlaylist(playlist)}} className="py-2 cursor-pointer">
              <Edit />
              Edit Playlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e)=>{e.stopPropagation();handleShare(playlist.playlist_id)}} className="py-2 cursor-pointer">
              <Share2 />
              Share Playlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e)=>{e.stopPropagation();setShowConfirm(true);setPlaylistId(playlist.playlist_id)}} className="py-2 cursor-pointer">
              <Trash />
              Delete Playlist
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const handleShare = (playlistId) => {
    navigator.clipboard.writeText(`https://music-go.vercel.app/user/public/playlist?list=${playlistId}`)
    toast.success('Link copied to clipboard')
  }

  const ConfirmDelete = () => {
    const playlist = userPlaylist?.playlists?.find((playlist) => playlist.playlist_id === playlistId)

    if(playlist){
      return (
        <AlertDialog open={showConfirm} >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {playlist.title}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your playlist.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={()=>setShowConfirm(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{deletePlaylist(playlistId, notify);setShowConfirm(false)}}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
      )
    }
  }

  console.log(userPlaylist)

  const PlaylistOverview = () => (
    <div className="h-full p-3 sm:p-8">

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
        {
          userPlaylist?.playlists?.length === 0 &&
          <NoPlaylist />
        }
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userPlaylist?.playlists?.slice(0, 3).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((playlist) => {
            const parts = playlist?.total_duration.split(" ");
            const duration =
              parts[0] + " " + parts[1].slice(0, 3) + " " +
              parts[3] + " " + parts[4].slice(0, 3);

            return (
            <div 
              key={playlist.playlist_id}
              onClick={() => openPlaylist(playlist)}
              className="p-6 transition-colors bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 group relative"
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
      {
        userPlaylist?.playlists?.length > 0 &&
        <div>
        <h2 className="mb-4 text-2xl font-bold">All Playlists</h2>
        <div className="flex flex-col gap-3 space-y-3">
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
              className="flex items-center px-3 py-2 space-x-4 transition-colors rounded-lg cursor-pointer sm:p-4 hover:bg-gray-800 group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br hidden rounded-lg sm:flex items-center justify-center relative overflow-hidden`}>
                <div className="text-xl text-white">♪</div>
                <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-opacity-0 bg-gradient-to-br from-purple-600 to-pink-600 group-hover:bg-opacity-50">
                  <Library className="absolute text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-100 top-1/2 left-1/2 w-7 h-7 group-hover:opacity-0" />
                  <Play className="absolute text-white transition-opacity duration-300 transform -translate-x-1/2 -translate-y-1/2 opacity-0 top-1/2 left-1/2 w-7 h-7 group-hover:opacity-100" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white">{playlist?.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{playlist?.description}</p>
                <div className='flex items-center'>
                <p className="mt-1 text-xs text-gray-500">{playlist?.song_count} songs</p>
                <p className="mt-1 text-xs text-gray-500"> • {duration}</p>
                <p className="hidden mt-1 text-xs text-gray-500 sm:block"> • Created {dateAdded}</p>
                </div>

              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-xs px-2 py-1 rounded ${playlist.isPublic ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}>
                  {playlist?.privacy.toUpperCase()}
                </span>
                <div className="text-gray-400 transition-all  hover:text-white">
                  <PlaylistDropdown playlist={playlist} />
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
      }

      <div className="h-32"></div>
    </div>
  );

  useEffect(()=>{
    getUserPlaylists()
  }, [])

  return (
    <div className="flex w-full h-full overflow-hidden text-white ">
      
      {/* Add PlaylistModal */}
      <PlaylistModal
      playlistName={playlistName}
      setPlaylistName={setPlaylistName}
      description={description}
      setDescription={setDescription}
      coverImage={coverImage}
      handleImageUpload={handleImageUpload}
      isPrivate={isPrivate}
      setIsPrivate={setIsPrivate}
      handleSubmit={handleSubmit}
      setModalIsOpen={setModalIsOpen}
      modalIsOpen={modalIsOpen}
      playlistId={playlistId}
      />

      {/* Render current view */}
      <div className="flex flex-col flex-1 h-full overflow-auto">
        <ConfirmDelete />
      <PlaylistOverview />
      </div>
      <Toaster position='bottom-right' />
    </div>
  );
};

export default UserPlaylist;