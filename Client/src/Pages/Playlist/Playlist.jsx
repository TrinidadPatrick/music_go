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
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import ModalComponent from '../../Components/Modal';
import { useAuth } from '../../Auth/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import useSongDetails from '../../Stores/SongDetailStore';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';

const Playlist = () => {
  const navigate = useNavigate()
  const { user, getUser } = useAuth()
  const [params] = useSearchParams()
  const list = params.get('list')
  const { formatTime } = useFormatTimeStore()
  const { getPlaylist, playlist } = usePublicPlaylistStore()
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const library = useLibraryStore(state => state.library)
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
    getPlaylist(list, navigate)
  }, [])

  const playAll = () => {
    setSongList(playlist.tracks)
    setCurrentSong(playlist.tracks[0])
  }

  const showDropdown = (track) => {
    return track === selectedTrack && !modalIsOpen
  }

  const playAllShuffled = () => {
    const index = Math.floor(Math.random() * playlist.tracks.length);
    setSongList(playlist.tracks)
    setCurrentSong(playlist.tracks[index])
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
    if (currentSong?.videoId !== track.videoId) {
      setSongList(playlist.tracks)
      setCurrentSong(track)
      setIsPlaying(true)
      setIsLoading(true)
    }
  }

  const handleSaveSong = (track) => {
    const data = { ...track, album: null }
    setSelectedTrack(null)
    saveToLibrary(data)
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
        album: null,
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

  const isSaved = (videoId) => {
    return library?.library_songs?.some((song) => song.videoId === videoId)
  }

  const DropDown = () => {
    const isAlreadySaved = isSaved(selectedTrack?.videoId)
    return (
      <div className="w-48 bg-gray-800 rounded-lg shadow-lg z-[100]">
        <ul className="text-sm text-white p-2 space-y-2">
          {selectedTrack?.videoId && (
            <li 
              onClick={(e) => { e.stopPropagation(); handleSaveSong(selectedTrack) }} 
              className={`hover:bg-gray-700 ${isAlreadySaved ? 'text-red-500' : ''} p-2 rounded flex items-center gap-2`}
            >
              {isAlreadySaved ? 
                <BookMinus size={16} className='text-red-500' /> : 
                <Library size={16} className='text-gray-400' />
              }
              {isAlreadySaved ? 'Remove from Library' : 'Add to Library'}
            </li>
          )}
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

  const Loader = () => {
    return (
      <div className="bg-gray-900 text-white min-h-screen">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 px-6 py-6 md:px-8 md:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            {/* Album Art Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-700/70 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Playlist Info Skeleton */}
            <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
              {/* Title */}
              <div className="h-8 sm:h-10 md:h-12 bg-gray-600/70 rounded animate-pulse w-full max-w-xs"></div>
              
              {/* Subtitle Info */}
              <div className="space-y-2">
                <div className="h-3 md:h-4 bg-gray-600/70 rounded animate-pulse w-40 sm:w-48"></div>
              </div>
              
              {/* Control Buttons Skeleton */}
              <div className="flex items-center gap-4 pt-2 md:pt-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-600/70 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Song List Section */}
        <div className="px-4 py-6 md:px-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700 mb-4">
            <div className="col-span-1">#</div>
            <div className="col-span-6 md:col-span-7">TITLE</div>
            <div className="hidden md:block col-span-3">DATE ADDED</div>
            <div className="col-span-5 md:col-span-1 text-right">
              <div className="w-4 h-4 bg-gray-600 rounded animate-pulse ml-auto"></div>
            </div>
          </div>
          
          {/* Song Rows Skeleton */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg group">
              {/* Track Number */}
              <div className="col-span-1 flex items-center">
                <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              
              {/* Song Info */}
              <div className="col-span-6 md:col-span-7 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="h-4 bg-gray-600 rounded animate-pulse w-full max-w-xs"></div>
                  <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
                </div>
              </div>
              
              {/* Date Added (Hidden on mobile) */}
              <div className="hidden md:flex col-span-3 items-center">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
              </div>
              
              {/* Duration */}
              <div className="col-span-5 md:col-span-1 flex items-center justify-end">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-8"></div>
              </div>
            </div>
          ))}
        </div>
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
                {selectedTrack?.artists ? selectedTrack?.artists.map((artist) => artist.name).join(', ') : ''}
              </span>
            </div>

            <button className='absolute right-3 top-3 cursor-pointer' onClick={() => setModalIsOpen(false)}>
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </header>

          {/* Search playlist */}
          <div className="border-b border-slate-700 flex-shrink-0 p-5">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
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
    <div className="text-white h-full w-full overflow-hidden flex px-5">
      <Modal />
      {playlist?.tracks?.length === 0 ? (
        <Loader />
      ) : (
        <div className="flex-1 h-full overflow-auto">
          {/* Playlist Header */}
          <div className="bg-gradient-to-br from-green-600 via-blue-900 to-indigo-900 p-3 sm:p-8 rounded sm: h-fith-60 flex w-full">
            <div className="flex flex-row items-center sm:items-end gap-6 w-full">
              <div 
                style={{
                  backgroundImage: `url(${playlist?.thumbnails ? (playlist?.thumbnails[1]?.url || playlist?.thumbnails[0]?.url) : ''})`
                }} 
                className="h-full aspect-square hidden sm:w-44 sm:h-44 rounded-lg shadow-2xl sm:flex items-center bg-cover justify-center"
              />
              
              <div className="h-full w-full justify-center sm:justify-end flex flex-col gap-4">
                {/* Title */}
                <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1">
                  {playlist?.title}
                </p>
                {/* Additional Info */}
                <div className="flex flex-row items-start sm:items-center space-x-2 text-sm text-gray-300">
                  <span className='hidden sm:block text-green-500'>•</span>
                  <span>{playlist?.trackCount} songs</span>
                  <span className='hidden sm:block'>•</span>
                  <span>about {playlist?.duration}</span>
                </div>
                {/* Controls */}
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => playAll()} 
                    className="w-12 h-12 cursor-pointer bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors hover:scale-105 transform"
                  >
                    <Play size={20} className="ml-1" />
                  </button>
                  <button 
                    onClick={() => playAllShuffled()} 
                    className="text-white cursor-pointer hover:bg-white/20 bg-white/10 p-2 rounded-full hover:text-white transition-colors"
                  >
                    <ShuffleIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="px-4 sm:px-6 mt-10">
            {/* Table Header – Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-11 md:grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800 mb-4">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Title</div>
              <div className="col-span-1 flex justify-center">
                <Clock size={16} />
              </div>
              <div className="col-span-1 flex justify-center"></div>
            </div>

            {/* Track Rows */}
            <div className="space-y-1">
              {playlist?.tracks?.map((track, index) => (
                <div
                  onClick={() => handleSelectSong(track)}
                  key={index}
                  className={`${
                    (currentSong?.videoId || "") === track?.videoId ? "bg-gray-800" : ""
                  } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-2 sm:px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
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
                  <div className="col-span-10 sm:col-span-8 md:col-span-8 flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden sm:block hidden">
                      <img src={track.thumbnails[0].url} alt={track.title} className="w-full h-full object-cover" />
                    </div>
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
                        {track.artists.map((artist) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Heart – only More shown on mobile */}
                  <div className="relative col-span-1 flex items-center justify-center md:justify-center space-x-2">
                    {/* Duration */}
                    <p className="hidden sm:block text-sm text-gray-400">
                      {formatTime(track.duration_seconds)}
                    </p>

                    {/* More Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoreOption(track) }}
                      className="text-gray-400 hidden md:group-hover:flex justify-center items-center hover:text-white transition-all group-hover:opacity-100 cursor-pointer p-1 hover:bg-gray-900 rounded-full"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {showDropdown(track) && (
                      <div className='absolute z-[100] hidden md:block right-10 bottom-0 origin-bottom'>
                        <DropDown />
                      </div>
                    )}
                  </div>

                  {/* More */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMoreOption(track) }}
                    className="text-gray-400 md:hidden flex justify-center items-center hover:text-white transition-all group-hover:opacity-100 p-1 min-w-[30px] cursor-pointer relative"
                  >
                    <MoreHorizontal size={16} />
                    {showDropdown(track) && (
                      <div className='absolute z-[100] right-7 bottom-0 origin-bottom'>
                        <DropDown />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Playlist