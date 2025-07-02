import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
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
import useScreenSize from '../../Auth/ScreenSizeProvider';
import http from '../../../http';
import ListLoader from '../../Components/ListLoader';

const UserPlaylistDetail = () => {
  const navigate = useNavigate()
  const { width } = useScreenSize()
  const { user, getUser } = useAuth()
  const [params] = useSearchParams()
  const playlistId = params.get('playlistId')
  const { formatTime } = useFormatTimeStore()

  //Library Store
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const library = useLibraryStore(state => state.library)

  //Music Player Store
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
  const currentSong = useMusicPlayerStore(state => state.currentSong)
  const isPlaying = useMusicPlayerStore(state => state.isPlaying)
  const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)

  //Playlist Store
  const removeFromPlaylist = useUserPlaylistStore(state => state.removeFromPlaylist)
  const getPlaylistDetail = useUserPlaylistStore(state => state.getPlaylistDetail)
  const playlistDetail = useUserPlaylistStore(state => state.playlistDetail)
  
  const [selectedTrack, setSelectedTrack] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [playlistSongs, setPlaylistSongs] = useState([])

  const getAllPlaylistSongs = async (playlistId) => {
    const limit = 20
    let offset = 0
    let stopFetching = false
    while (!stopFetching) {
      try {
        const result = await http.get(`auth/music/get_playlist_songs?playlistId=${playlistId}&limit=${limit}&offset=${offset}`);
        const fetchedSongs = result.data.data.songs;
    
        if (fetchedSongs.length === 0) {
          stopFetching = true;
          break;
        }
    
        setPlaylistSongs(prev => {
            const existingIds = new Set(prev.map(song => song.videoId));
            const uniqueNewSongs = fetchedSongs.filter((song) => !existingIds.has(song.videoId));
            return [...prev, ...uniqueNewSongs];
        })

        offset += limit;
        
        await new Promise(resolve => setTimeout(resolve, 700));
    
      } catch (error) {
        console.log(error);
        set({ error: error.response?.data?.message || 'An error occurred' });
        break;
      }
    
    }
  }

  useEffect(() => {
    if(playlistId){
      getPlaylistDetail(playlistId)
      getAllPlaylistSongs(playlistId)
    }
  }, [playlistId])

  const playAll = () => {
    setSongList(playlistSongs)
    setCurrentSong(playlistSongs[0])
  }

  const showDropdown = (track) => {
    return track === selectedTrack && !modalIsOpen
  }

  const playAllShuffled = () => {
    const index = Math.floor(Math.random() * playlistSongs.length);
    setSongList(playlistSongs)
    setCurrentSong(playlistSongs[index])
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
      setSongList(playlistSongs)
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

  const handleRemoveFromPlaylist = async (track) => {
    const index = playlistSongs.findIndex((song) => song.videoId === track.videoId)

    if(index !== -1){
        const newData = [...playlistSongs]
        newData.splice(index, 1)
        setPlaylistSongs(newData)
        removeFromPlaylist(selectedTrack.videoId, playlistDetail.playlist_id)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(`https://music-go.vercel.app/user/public/playlist?list=${playlistDetail.playlist_id}`)
    toast.success('Link copied to clipboard')
  }

  const DropDown = () => {
    const isSaved = library?.library_songs?.some((song) => song.videoId === selectedTrack?.videoId)
    return (
      <div className="w-48 bg-gray-800 rounded-lg shadow-lg z-[100]">
        <ul className="p-2 space-y-2 text-sm text-white">
          {selectedTrack?.videoId && (
            <li 
              onClick={(e) => { e.stopPropagation(); handleSaveSong(selectedTrack) }} 
              className={`hover:bg-gray-700 ${isSaved ? 'text-red-500' : ''} p-2 rounded flex items-center gap-2`}
            >
              {isSaved ?
                <BookMinus size={16} className='text-red-500' /> : 
                <Library size={16} className='text-gray-400' />
              }
              {isSaved ? 'Remove from Library' : 'Add to Library'}
            </li>
          )}
          <li 
            onClick={(e) => { e.stopPropagation();handleRemoveFromPlaylist(selectedTrack) }} 
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-700"
          >
            <Disc size={16} className='text-gray-400' />
            Remove from Playlist
          </li>
          <li onClick={(e) => { e.stopPropagation();navigator.clipboard.writeText(``) }}  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
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
              <div className='w-1 h-1 bg-gray-400 rounded-full' />
              <span className='text-gray-400 line-clamp-1'>
                {selectedTrack?.artists}
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

  console.log(playlistDetail)


  return (
    <div className="flex w-full h-full sm:px-5 overflow-hidden text-white">
      <Modal />
      {
      
      playlistDetail === null ? (
        <ListLoader />
      ) : 
      
      (
        <div className="flex-1 h-full overflow-auto">
          {/* Playlist Header */}
          <div className="flex w-full p-3 rounded sm:p-8 sm: h-fith-60">
            <div className="flex flex-row items-center w-full gap-6 sm:items-end">
            <div className="items-center justify-center hidden h-full bg-cover rounded-lg shadow-2xl aspect-square sm:w-44 sm:h-44 bg-gradient-to-br from-purple-500 to-pink-500 sm:flex"> 
              <Music size={width >= 640 ? 110 : 25} className="text-white" />
            </div>
              
              <div className="flex flex-col justify-center w-full h-full gap-4 sm:justify-end">
                {/* Title */}
                <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1">
                  {playlistDetail?.title}
                </p>
                {/* Additional Info */}
                <div className="flex flex-row items-start space-x-2 text-sm text-gray-300 sm:items-center">
                  <span className='hidden text-green-500 sm:block'>•</span>
                  <span>{playlistDetail?.song_count} songs</span>
                  <span className='hidden sm:block'>•</span>
                  <span>about {playlistDetail?.total_duration}</span>
                </div>
                {/* Controls */}
                <div className="flex items-center space-x-3">
                  <button 
                  disabled={playlistDetail?.song_count === 0}
                    onClick={() => playAll()} 
                    className="flex items-center justify-center w-12 h-12 transition-colors transform bg-green-500 rounded-full cursor-pointer hover:bg-green-400 hover:scale-105"
                  >
                    <Play size={20} className="ml-1" />
                  </button>
                  <button 
                  disabled={playlistDetail?.song_count === 0}
                    onClick={() => playAllShuffled()} 
                    className="p-2 text-white transition-colors rounded-full cursor-pointer hover:bg-white/20 bg-white/10 hover:text-white"
                  >
                    <ShuffleIcon size={20} />
                  </button>
                  {
                    playlistDetail?.privacy === 'public' &&
                    <button onClick={handleShare} className="p-2 text-white transition-colors rounded-full cursor-pointer hover:bg-white/20 bg-white/10 hover:text-white">
                      <Share size={20} className="text-gray-200 hover:text-white" />
                    </button>
                  }
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
            <div className="space-y-1 px-2">
              {playlistSongs?.map((track, index) => {
              return (
                <div
                  onClick={() => handleSelectSong(track)}
                  key={index}
                  className={`${
                    (currentSong?.videoId || "") === track?.videoId ? "bg-gray-800" : ""
                  } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-3 sm:px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
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
                    {/* Image */}
                    <div className="relative flex items-center justify-center flex-none w-10 h-10 overflow-hidden bg-gray-700 rounded sm:w-12 sm:h-12">
                      {
                        track.thumbnail ?
                        <img referrerPolicy='no-referrer' src={track.thumbnail} alt={track.title} className="object-cover w-full h-full" />
                        :
                            <Music size={16} className="text-white" />
                      }
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
                        {track.artists}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Heart – only More shown on mobile */}
                  <div className="relative flex items-center justify-center col-span-1 space-x-2 md:justify-center ">
                      <p className="hidden text-sm text-gray-400 sm:block">
                        {formatTime(track.duration_seconds)}
                      </p>
                      <button onClick={(e) => { e.stopPropagation(); handleMoreOption(track) }} className="items-center justify-center p-2 text-gray-400 transition-all rounded-full cursor-pointer md:hidden md:group-hover:flex hover:text-white group-hover:opacity-100 hover:bg-gray-900">
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
              )})}
            </div>
          </div>
        </div>
      )
      
      }
    </div>
  )
}

export default UserPlaylistDetail