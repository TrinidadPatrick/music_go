import React, { useCallback, useEffect, useState } from 'react'
import useHomeContentStore from '../../Stores/HomeContentStore'
import { Play, MoreHorizontal, Music, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useSongDetails from '../../Stores/SongDetailStore';
import { Toaster } from 'react-hot-toast';
import EqualizerAnimation from '../../Components/EqualizerAnimation';
import { useAuth } from '../../Auth/AuthProvider';
import ModalComponent from '../../Components/Modal';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';

const HomeContents = () => {
  const navigate = useNavigate()
  const {isAuthenticated, user, getUser} = useAuth()
  const [selectedDropdown, setSelectedDropdown] = useState(null)
  const {homeContents, getHome} = useHomeContentStore()
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const currentSong = useMusicPlayerStore(state => state.currentSong)
  const getSongRecommendation = useGetSongRecommendation(state => state.getSongRecommendation)
  const library = useLibraryStore(state => state.library)
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const getSongDetails = useSongDetails(state => state.getSongDetails)
  const saveToUserPlaylist = useUserPlaylistStore(state => state.saveToUserPlaylist)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    getHome()
  }, [])

  const handleSelect = async (track) => {
    if(track?.playlistId){
      navigate(`/public/playlist?list=${track.playlistId}`)
    }else if(track?.type === 'Album' && track?.browseId){
      navigate(`/public/album?list=${track.browseId}`)
    }else if(track?.videoId){
      if(currentSong?.videoId !== track.videoId){
        setCurrentSong(track)
        const songList = await getSongRecommendation(track.videoId)
        if(songList){
          setSongList(songList.tracks)
        }
      }
    }
  }

  const handleMoreOption = (track) => {
    if(track === selectedDropdown){
      setSelectedDropdown(null)
    }else{
      setSelectedDropdown(track)
    }
  }

  const isSaved = (videoId) => {
    return library?.library_songs?.some((song) => song.videoId === videoId)
  }

  const DropDown = () => {
    return (
      <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-90">
        <ul className="text-sm text-white p-2 space-y-2">
          {
            selectedDropdown?.videoId &&
            <li onClick={(e)=>{e.stopPropagation();handleSaveToLibrary(selectedDropdown)}} className="hover:bg-gray-700 p-2 rounded">{isSaved(selectedDropdown?.videoId) ? 'Remove from Library' : 'Add to Library'}</li>
          }
          <li onClick={(e)=>{e.stopPropagation();selectPlaylist(selectedDropdown)}} className="hover:bg-gray-700 p-2 rounded">Add to Playlist</li>
          <li className="hover:bg-gray-700 p-2 rounded">Share</li>
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
              <span className='text-gray-400'>{selectedDropdown?.title}</span>
              <div className='w-1 h-1 rounded-full bg-gray-400' />
              <span className='text-gray-400'>{selectedDropdown?.artists ? selectedDropdown?.artists.map((artist) => artist.name).join(', ') : ''}</span>
            </div>

            <button className='absolute right-3 top-3 cursor-pointer' onClick={()=>setModalIsOpen(false)}>
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </header>

          {/* Search playlist */}
          <div className=" border-b border-slate-700 flex-shrink-0 p-5">
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
          {
            user && user?.user?.playlists.map((playlist, index)=>{
              return (
                <button key={index} onClick={()=>handleSaveToPlaylist(selectedDropdown, playlist)} className='w-full flex gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded'>
                  {/* Thumbnail */}
                  <div className='h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded'>
                    {
                      playlist.thumbnal ?
                      <img src={playlist.thumbnail} alt={playlist.title} className='w-full h-full object-cover' />
                      :
                      <Music size={25} className='text-white' />
                    }
                  </div>
                  {/* Title */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-white text-start text-sm font-medium'>{playlist.title}</p>
                    <p className='text-gray-400 text-start text-sm'>{playlist.song_count} songs</p>
                  </div>
                </button>
              )
            })
          }
          </div>

        </div>
      </ModalComponent>
    )
  }, [modalIsOpen, selectedDropdown, user])

  const showDropdown = (track) => {
    return track === selectedDropdown
  }

  const handleSaveToLibrary = async (track) => {
    if(track?.videoId){
      const songDetails = await getSongDetails(track.videoId)
      const data = songDetails.videoDetails
      const songData = {
        videoId : data.videoId,
        title : data.title,
        artists : [{name : data.author}],
        album : null,
        duration_seconds : data.lengthSeconds,
        thumbnails : data.thumbnail ? data.thumbnail.thumbnails : null,
      }
      saveToLibrary(songData)
    }
  }

  const selectPlaylist = async (track) => {
    setModalIsOpen(true)
}

  const handleSaveToPlaylist = async (track, playlist) => {
    setModalIsOpen(false)
    if(track?.videoId){
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
      // console.log(songData)
      const result = await saveToUserPlaylist(songData)
      if(result === 'success'){
        setSelectedDropdown(null)
        getUser()
      }
    }
  }

  return (
    <main className='w-full flex flex-col gap-4 p-2 md:p-6'>
      <Modal />
      {
        homeContents.length > 0 && homeContents?.map((content, index) => {
          return (
            <div key={index} className='flex flex-col gap-3'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{content.title}</h2>
              </div>
              {/* Track lists */}
              <div className='flex gap-3 overflow-x-auto md:p-3 hide-scrollbar'>
              <div className='flex gap-3 w-max'>
                {
                  content?.contents?.map((track, index) => {
                    const show = showDropdown(track)
                    const isCurrentSong = track?.videoId && currentSong?.videoId === track.videoId
                    return (
                      <div onClick={()=>handleSelect(track)} key={index} className='group cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
                      rounded-2xl p-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 overflow-show 
                      flex-shrink-0 w-60 overflow-hidden'>

                        {/* more button */}
                        {
                          isAuthenticated &&
                          <button onClick={(e)=>{e.stopPropagation();handleMoreOption(track)}} className='md:hidden md:group-hover:block hover:bg-gray-500 hover:rounded-full p-1 cursor-pointer absolute right-5 z-50'>
                                  <MoreHorizontal size={20} className='text-white  z-10 relative ' />
                                  {
                                    showDropdown(track) &&
                                    <DropDown />
                                  }
                        </button>
                        }

                        <button className={`p-3 ${isCurrentSong ? 'block' : 'hidden'} cursor-pointer w-14 h-14 justify-center items-center group-hover:flex rounded-full bg-white/80 shadow-2xl absolute z-40 left-1/2 transform -translate-x-1/2 top-24`}>
                                {
                                  isCurrentSong ?
                                  <EqualizerAnimation /> :
                                  <Play  className='text-gray-700 flex items-center justify-center cursor-pointer transition-transform duration-200' />
                                }
                                
                        </button>
                    
                        {/* Hover overlay */}
                        <div className={`${isCurrentSong ? 'block' : 'hidden'} group-hover:block w-full h-full opacity-50 brightness-0 z-20 bg-black absolute top-0 left-0`} />
                    
                        {/* Image */}
                        <div className='w-full flex items-center justify-center aspect-square bg-cover bg-center opacity-75 bg-no-repeat rounded-lg' style={{backgroundImage: `url(${track?.thumbnails[1]?.url || track?.thumbnails[0]?.url})`}} />

                        {/* Title and artists */}
                        <div className='mt-2 flex flex-col gap-1'>
                            <h3 className='text-base text-white line-clamp-2 text-start font-medium'>{track.title}</h3>
                            <p className='text-sm text-gray-400'>{track?.artists && track?.artists.map((artist) => artist?.name).join(', ')}</p>
                        </div>

                      </div>
                    )
                  })
                }
                </div>
              </div>
            </div>
          )
        })
      }
      <Toaster position='bottom-right' />
    </main>
  )
}

export default HomeContents