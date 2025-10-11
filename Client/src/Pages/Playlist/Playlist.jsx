import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { 
  Play, 
  Pause, 
  MoreHorizontal, 
  Clock, 
  Share, 
  ShuffleIcon, 
  Music, 
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
import ListLoader from '../../Components/ListLoader';

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
  const {isAuthenticated} = useAuth()

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
        <ul className="p-2 space-y-2 text-sm text-white">
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
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
          >
            <Disc size={16} className='text-gray-400' />
            Add to Playlist
          </li>
          <li className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
            <Share size={16} className='text-gray-400' />
            Share
          </li>
        </ul>
      </div>
    )
  }

  const Loader = () => {
    return (
      <div className="min-h-screen text-white bg-gray-900">
        {/* Header Section */}
        <div className="px-6 py-6 bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 md:px-8 md:py-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            {/* Album Art Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-700/70 animate-pulse"></div>
            </div>
            
            {/* Playlist Info Skeleton */}
            <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
              {/* Title */}
              <div className="w-full h-8 max-w-xs rounded sm:h-10 md:h-12 bg-gray-600/70 animate-pulse"></div>
              
              {/* Subtitle Info */}
              <div className="space-y-2">
                <div className="w-40 h-3 rounded md:h-4 bg-gray-600/70 animate-pulse sm:w-48"></div>
              </div>
              
              {/* Control Buttons Skeleton */}
              <div className="flex items-center gap-4 pt-2 md:pt-4">
                <div className="w-12 h-12 bg-green-500 rounded-full md:w-14 md:h-14 animate-pulse"></div>
                <div className="w-8 h-8 rounded-full md:w-10 md:h-10 bg-gray-600/70 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Song List Section */}
        <div className="px-4 py-6 md:px-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 mb-4 text-sm text-gray-400 border-b border-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-6 md:col-span-7">TITLE</div>
            <div className="hidden col-span-3 md:block">DATE ADDED</div>
            <div className="col-span-5 text-right md:col-span-1">
              <div className="w-4 h-4 ml-auto bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Song Rows Skeleton */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 group">
              {/* Track Number */}
              <div className="flex items-center col-span-1">
                <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              
              {/* Song Info */}
              <div className="flex items-center col-span-6 gap-3 md:col-span-7">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="w-full h-4 max-w-xs bg-gray-600 rounded animate-pulse"></div>
                  <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Date Added (Hidden on mobile) */}
              <div className="items-center hidden col-span-3 md:flex">
                <div className="w-24 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              
              {/* Duration */}
              <div className="flex items-center justify-end col-span-5 md:col-span-1">
                <div className="w-8 h-4 bg-gray-600 rounded animate-pulse"></div>
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
              <div className='w-1 h-1 bg-gray-400 rounded-full' />
              <span className='text-gray-400 line-clamp-1'>
                {selectedTrack?.artists ? selectedTrack?.artists.map((artist) => artist.name).join(', ') : ''}
              </span>
            </div>

            <button className='absolute cursor-pointer right-3 top-3' onClick={() => setModalIsOpen(false)}>
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </header>

          {/* Search playlist */}
          <div className="flex-shrink-0 p-5 border-b border-slate-700">
            <div className="relative">
              <Search size={20} className="absolute transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search playlists..."
                className="w-full py-2 pl-10 pr-4 text-white transition-all border rounded-lg bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className='flex w-full gap-2 p-1 rounded cursor-pointer hover:bg-gray-700'
                >
                  {/* Thumbnail */}
                  <div className='h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded'>
                    {playlist.thumbnal ? (
                      <img src={playlist.thumbnail} alt={playlist.title} className='object-cover w-full h-full' />
                    ) : (
                      <Music size={25} className='text-white' />
                    )}
                  </div>
                  {/* Title */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-white text-start'>{playlist.title}</p>
                    <p className='text-sm text-gray-400 text-start'>{playlist.song_count} songs</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </ModalComponent>
    )
  }, [modalIsOpen, selectedTrack])
  
  return playlist === null ? (
    <ListLoader />
  ) : (
    <div className="flex w-full h-full sm:px-5 overflow-hidden text-white">
      <Modal />
      {playlist?.tracks?.length === 0 ? (
        <Loader />
      ) : (
        <div className="flex-1 h-full overflow-auto">
          {/* Playlist Header */}
          <div className="flex w-full p-3 rounded sm:p-8 sm: h-fith-60">
            <div className="flex flex-row items-center w-full gap-6 sm:items-end">
              <div 
                style={{
                  backgroundImage: `url(${playlist?.thumbnails ? (playlist?.thumbnails[1]?.url || playlist?.thumbnails[0]?.url) : ''})`
                }} 
                className="items-center justify-center hidden h-full bg-cover rounded-lg shadow-2xl aspect-square sm:w-44 sm:h-44 sm:flex"
              />
              
              <div className="flex flex-col justify-center w-full h-full gap-4 sm:justify-end">
                {/* Title */}
                <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1">
                  {playlist?.title}
                </p>
                {/* Additional Info */}
                <div className="flex flex-row items-start space-x-2 text-sm text-gray-300 sm:items-center">
                  <span className='hidden text-green-500 sm:block'>•</span>
                  <span>{playlist?.trackCount} songs</span>
                  <span className='hidden sm:block'>•</span>
                  <span>about {playlist?.duration}</span>
                </div>
                {/* Controls */}
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => playAll()} 
                    className="flex items-center justify-center w-12 h-12 transition-colors transform bg-green-500 rounded-full cursor-pointer hover:bg-green-400 hover:scale-105"
                  >
                    <Play size={20} className="ml-1" />
                  </button>
                  <button 
                    onClick={() => playAllShuffled()} 
                    className="p-2 text-white transition-colors rounded-full cursor-pointer hover:bg-white/20 bg-white/10 hover:text-white"
                  >
                    <ShuffleIcon size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Track List */}
          <div className="px-0 mt-10 sm:px-6">
            {/* Table Header – Hidden on mobile */}
            <div className="hidden grid-cols-11 gap-4 px-4 py-2 mb-4 text-xs tracking-wide text-gray-400 uppercase border-b border-gray-800 sm:grid md:grid-cols-12">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Title</div>
              <div className="flex justify-center col-span-1">
                <Clock size={16} />
              </div>
              <div className="flex justify-center col-span-1"></div>
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
                  <div className="items-center hidden col-span-1 sm:flex">
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(track);
                      }}
                      className="hidden text-white group-hover:block hover:text-green-400"
                    >
                      {(currentSong?.videoId || "") === track.videoId && isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                  </div>

                  {/* Title – always visible */}
                  <div className="flex items-center min-w-0 col-span-11 space-x-3 sm:col-span-8 md:col-span-8">
                    <div className="hidden w-10 h-10 overflow-hidden bg-gray-700 rounded sm:block">
                      <img src={track.thumbnails[0].url} alt={track.title} className="object-cover w-full h-full" />
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
                      <p className="text-xs text-gray-400 truncate sm:text-sm">
                        {track.artists.map((artist) => artist.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Heart – only More shown on mobile */}
                  <div className="relative flex items-center justify-center col-span-1 space-x-2 md:justify-center ">
                      <p className="hidden text-sm text-gray-400 sm:block">
                        {formatTime(track.duration_seconds)}
                      </p>
                      {/* <button onClick={(e) => { e.stopPropagation(); handleMoreOption(track) }} className="items-center justify-center p-1 text-gray-400 transition-all rounded-full cursor-pointer md:hidden md:group-hover:flex hover:text-white group-hover:opacity-100 hover:bg-gray-900">
                        <MoreHorizontal size={16} />
                      </button> */}
                      {
                      showDropdown(track) && 
                      (
                        <div className='absolute z-[10] block right-8 sm:right-10 bottom-0 origin-bottom'>
                          <DropDown />
                        </div>
                      )
                      }
                    </div>

                  
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