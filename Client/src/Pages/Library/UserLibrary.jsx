import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { 
  Heart, 
  Plus, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Clock, 
  Download,
  Share, 
  ShuffleIcon, 
  Music, 
  PlayIcon, 
  BookMinus, 
  Library, 
  Disc, 
  X, 
  Search
} from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import usePublicAlbumStore from '../../Stores/PublicAlbumStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useScreenSize from '../../Auth/ScreenSizeProvider';
import ModalComponent from '../../Components/Modal';
import { useAuth } from '../../Auth/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import useSongDetails from '../../Stores/SongDetailStore';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';

const UserLibrary = () => {
  const { width } = useScreenSize()
  const { user, getUser } = useAuth()
  const { formatTime } = useFormatTimeStore()
  const { getLibrary, library, isLoading, saveToLibrary } = useLibraryStore()
  
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
  const currentSong = useMusicPlayerStore(state => state.currentSong)
  const isPlaying = useMusicPlayerStore(state => state.isPlaying)
  const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)
  
  const getSongDetails = useSongDetails(state => state.getSongDetails)
  const saveToUserPlaylist = useUserPlaylistStore(state => state.saveToUserPlaylist)
  
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getLibrary()
  }, [])

  const playAll = () => {
    setSongList(library.library_songs)
    setCurrentSong(library.library_songs[0])
  }

  const showDropdown = (track) => {
    return track === selectedTrack && !modalIsOpen
  }

  const playAllShuffled = () => {
    const index = Math.floor(Math.random() * library.library_songs.length);
    setSongList(library.library_songs)
    setCurrentSong(library.library_songs[index])
    toggleShuffle()
  }
  
  const handlePlayPause = (track) => {
    if (currentSong?.videoId === track.videoId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(track);  // This already sets isLoading, currentTime, etc.
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (track) => {
    if(track?.videoId !== currentSong?.videoId){
      setSongList(library.library_songs)
    setCurrentSong(track)
    setIsPlaying(true)
    setIsLoading(true)
    }
  }

  const handleRemoveFromLibrary = (track) => {
    const data = { ...track, album: track.album || null }
    setSelectedTrack(null)
    saveToLibrary(data) // This should remove if already exists
  }

  const handleMoreOption = (track) => {
    if (track === selectedTrack) {
      setSelectedTrack(null)
    } else {
      setSelectedTrack(track)
    }
  }

  const selectPlaylist = async (track) => {
    setModalIsOpen(true)
  }

  const handleSaveToPlaylist = async (track, playlist) => {
    setModalIsOpen(false)
    if (track?.videoId) {
      const songDetails = await getSongDetails(track.videoId)
      const data = songDetails.videoDetails
      const songData = {
        videoId: track.videoId,
        playlistId: playlist.playlist_id,
        title: track.title,
        artists: track.artists,
        album: track.album || null,
        duration_seconds: data.lengthSeconds,
        thumbnails: data.thumbnail ? data.thumbnail.thumbnails : null,
      }
      const result = await saveToUserPlaylist(songData)
      if (result === 'success') {
        setSelectedTrack(null)
        getUser()
      }
    }
  }

  const DropDown = () => {
    return (
      <div className="w-48 bg-gray-800 rounded-lg shadow-lg z-[10]">
        <ul className="text-sm text-white p-2 space-y-2">
          <li 
            onClick={(e) => { e.stopPropagation(); handleRemoveFromLibrary(selectedTrack) }} 
            className="hover:bg-gray-700 text-red-500 p-2 rounded flex items-center gap-2"
          >
            <BookMinus size={16} className='text-red-500' />
            Remove from Library
          </li>
          <li 
            onClick={(e) => { e.stopPropagation(); selectPlaylist(selectedTrack) }} 
            className="hover:bg-gray-700 p-2 rounded flex items-center gap-2"
          >
            <Disc size={16} className='text-gray-400' />
            Add to Playlist
          </li>
          <li className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
            <Share size={16} className='text-gray-400' />
            Share
          </li>
        </ul>
      </div>
    )
  }

  const Modal = useCallback(() => {
    return (
      <ModalComponent open={modalIsOpen} setOpen={setModalIsOpen}>
        <div className='flex flex-col gap-2 bg-gray-800 max-w-[500px] w-[500px]'>

          {/* Header */}
          <header className='relative p-5 border-b border-b-slate-700'>
            <h1 className='text-2xl font-bold text-white'>Add to Playlist</h1>

            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-400 line whitespace-nowrap'>{selectedTrack?.title}</span>
              <div className='w-1 h-1 rounded-full bg-gray-400' />
              <span className='text-gray-400 line-clamp-1'>
                {selectedTrack?.artists ? selectedTrack?.artists.join(', ') : ''}
              </span>
            </div>

            <button 
              className='absolute right-3 top-3 cursor-pointer' 
              onClick={() => setModalIsOpen(false)}
            >
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </header>

          {/* Search playlist */}
          <div className="border-b border-slate-700 flex-shrink-0 p-5">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search playlists..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Playlists */}
          <div className='flex flex-col p-4 gap-4 max-h-[400px] overflow-y-auto'>
            {user && user?.user?.playlists.map((playlist, index) => {
              return (
                <button 
                  key={index} 
                  onClick={() => handleSaveToPlaylist(selectedTrack, playlist)} 
                  className='w-full flex gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded'
                >
                  {/* Thumbnail */}
                  <div className='h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded'>
                    {playlist.thumbnal ? (
                      <img src={playlist.thumbnail} alt={playlist.title} className='w-full h-full object-cover' />
                    ) : (
                      <Music size={25} className='text-white' />
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-white text-start text-sm font-medium'>{playlist.title}</p>
                    <p className='text-gray-400 text-start text-sm'>{playlist.song_count} songs</p>
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </ModalComponent>
    )
  }, [modalIsOpen, selectedTrack])
  
  return (
    <div className="text-white w-full h-full overflow-hidden flex px-2 sm:px-5 pb-4">
      <Modal />
      
      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto flex flex-col">

        {/* Playlist Header */}
        <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-3 sm:p-8 sm: h-fith-60 flex w-full rounded">
          <div className="flex flex-row items-center sm:items-end gap-6 w-full">
            <div className="h-full aspect-square hidden sm:w-44 sm:h-44 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl sm:flex items-center bg-cover justify-center"> 
              <Music size={width >= 640 ? 110 : 25} className="text-white" />
            </div>
            
            <div className="h-full w-full justify-center sm:justify-end flex flex-col gap-2 md:gap-4">
              {/* Title */}
              <p className="text-3xl sm:text-[2.5rem] md:text-[2.9rem] font-medium">MY MUSIC LIBRARY</p>
              
              {/* Additional Info */}
              <div className="flex flex-row items-start sm:items-center space-x-2 text-sm text-gray-300">
                <span className='hidden sm:block text-green-500'>•</span>
                <span>{library?.total_songs} songs</span>
                {library?.total_songs > 0 && (
                  <>
                    <span className='hidden sm:block'>•</span>
                    <span>about {library?.total_duration}</span>
                  </>
                )}
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-3">
                <button 
                  disabled={library?.total_songs === 0} 
                  onClick={() => playAll()} 
                  className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer bg-green-500 disabled:bg-green-300 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors hover:scale-105 transform"
                >
                  <Play size={20} className="ml-1" />
                </button>
                <button 
                  disabled={library?.total_songs === 0} 
                  onClick={() => playAllShuffled()} 
                  className="text-white hover:bg-white/30 bg-white/10 p-2 rounded-full hover:text-white transition-colors cursor-pointer"
                >
                  <ShuffleIcon size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {library?.total_songs == 0 && (
          <div className='text-center text-gray-200 text-sm h-full flex justify-center items-center flex-col'>
            <h1 className='text-lg'>Your music library is empty</h1>
            <p className='text-gray-400 text-shadow-amber-600'>Add songs to your library to see them here</p>
          </div>
        )}

        {/* Track List */}
        {library?.total_songs > 0 && (
          <div className=" sm:px-6 mt-10">
            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-11 md:grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800 mb-4">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Title</div>
              <div className="hidden md:block col-span-2">Date added</div>
              <div className="col-span-1 flex justify-center">
                <Clock size={16} />
              </div>
              <div className="col-span-1 flex justify-center"></div>
            </div>

            {/* Track Rows */}
            <div className="space-y-1">
              {library?.library_songs?.map((track, index) => {
                const now = new Date();
                const createdAt = new Date(track?.created_at);
                const diffMs = now - createdAt;
                const diffMins = Math.floor(diffMs / (1000 * 60));
                const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const dateAdded = diffDays > 0
                  ? `${diffDays} days ago`
                  : diffHours > 0
                  ? `${diffHours} hours ago`
                  : diffMins > 0
                  ? `${diffMins} minutes ago`
                  : "a few seconds ago";

                return (
                  <div
                    onClick={() => handleSelectSong(track)}
                    key={track.videoId}
                    className={`${
                      (currentSong?.videoId || "") === track?.videoId ? "bg-gray-800" : ""
                    } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-2 sm:px-4 py-3 
                    rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
                  >
                    {/* Index - hidden on mobile */}
                    <div className="hidden sm:flex items-center col-span-1">
                      <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause(track);
                        }}
                        className="hidden group-hover:block text-white hover:text-green-400"
                      >
                        {(currentSong?.videoId || "") === track.videoId && isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                    </div>

                    {/* Title – always visible */}
                    <div className="col-span-11 sm:col-span-8 md:col-span-8 flex items-center space-x-3 min-w-0">
                      <div className="min-w-0">
                        <p
                          className={`font-medium ${
                            (currentSong?.videoId || "") === track.videoId
                              ? "text-green-400"
                              : "text-white"
                          } line-clamp-1 text-sm sm:text-base`}
                        >
                          {track.title}
                        </p>

                        {/* Artist – hidden on small screens */}
                        <p className="text-xs sm:text-sm text-gray-400 truncate">
                          {track.artists.join(", ")}
                        </p>
                      </div>
                    </div>

                    {/* Date added – hidden on mobile */}
                    <div className="hidden md:flex col-span-2 items-center">
                      <p className="text-sm text-gray-400">{dateAdded}</p>
                    </div>

                    {/* Duration & More – only More shown on mobile */}
                    <div className="relative col-span-1 flex items-center justify-center md:justify-center space-x-2 ">
                      <p className="hidden sm:block text-sm text-gray-400">
                        {formatTime(track.duration_seconds)}
                      </p>
                      <button onClick={(e) => { e.stopPropagation(); handleMoreOption(track) }} className="text-gray-400 md:hidden md:group-hover:flex justify-center items-center hover:text-white transition-all group-hover:opacity-100 cursor-pointer p-1 hover:bg-gray-900 rounded-full">
                        <MoreHorizontal size={16} />
                      </button>
                      {
                      showDropdown(track) && 
                      (
                        <div className='absolute z-[10] block right-10 bottom-0 origin-bottom'>
                          <DropDown />
                        </div>
                      )
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default UserLibrary