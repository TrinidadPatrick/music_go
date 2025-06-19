import React, { useCallback, useEffect, useState } from 'react'
import { MoreHorizontal, Music, Search, X} from 'lucide-react';
import useChartsStore from '../../Stores/TopChartsStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import http from '../../../http';
import useSongDetails from '../../Stores/SongDetailStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthProvider';
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore';
import ModalComponent from '../../Components/Modal';

const TopCharts = () => {
    const {charts, getCharts} = useChartsStore()
    const {isAuthenticated, user, getUser} = useAuth()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
    const library = useLibraryStore(state => state.library)
    const saveToUserPlaylist = useUserPlaylistStore(state => state.saveToUserPlaylist)
    const getSongDetails = useSongDetails(state => state.getSongDetails)
    const [selectedDropdown, setSelectedDropdown] = useState(null)
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        getCharts()
    }, [])

    const isSaved = (videoId) => {
        return library?.library_songs?.some((song) => song.videoId === videoId)
    }

    const handleMoreOption = (track) => {
        if(track === selectedDropdown){
          setSelectedDropdown(null)
        }else{
          setSelectedDropdown(track)
        }
    }

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

    const handleSelectSong = (track) => {
        if(currentSong?.videoId !== track.videoId){
          setCurrentSong(track)
          setIsLoading(true)
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
          album: track.album || null,
          duration_seconds: data.lengthSeconds,
          thumbnails: data.thumbnail ? data.thumbnail.thumbnails : null,
        }
        const result = await saveToUserPlaylist(songData)
        if(result === 'success'){
          setSelectedDropdown(null)
          getUser()
        }
      }
    }

    const DropDown = () => {
        return (
          <div className=" w-48 bg-gray-800 rounded-lg shadow-lg z-[100]">
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
                <span className='text-gray-400 line whitespace-nowrap'>{selectedDropdown?.title}</span>
                <div className='w-1 h-1 rounded-full bg-gray-400' />
                <span className='text-gray-400 line-clamp-1'>{selectedDropdown?.artists ? selectedDropdown?.artists.map((artist) => artist.name).join(', ') : ''}</span>
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
                  <button onClick={()=>handleSaveToPlaylist(selectedDropdown, playlist)} className='w-full flex gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded'>
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

  return charts?.length > 0 && (
     <div className='w-full h-full flex flex-col gap-4 p-2 md:p-6'>
        <Modal />
        <div className='flex-shrink-0'>
            <h2 className='text-2xl font-bold text-white'>Top Charts</h2>
        </div>
        
        <div className='flex-1 min-h-0  '>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:p-4'>
          {
            charts?.length > 0 && charts?.map((chart, index) => {
                const isCurrentSong = currentSong?.videoId === chart.videoId
                return (
                <div onClick={()=>{handleSelectSong(chart)}} key={index} className='group w-full cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
                rounded-2xl p-3 transition-all duration-500 overflow-show hover:shadow-2xl border border-white/10 
                flex gap-3 justify-between items-center
                flex-shrink-0 z-0'>
                    
                  {/* Hover overlay */}
                  <div className={`${isCurrentSong ? 'block' : 'hidden'} group-hover:block w-full h-full opacity-50 bg-gray-800 rounded-2xl absolute top-0 left-0 z-10`}>
                  </div>
                  {/* Image and Title */}
                  <div className='flex gap-3 items-center flex-1 min-w-0'>
                      <div className='flex gap-3 items-center h-full'>
                          <span className='text-gray-200'>{index + 1}</span>
                      </div>
                      {/* Image */}
                      <div className='flex-none'>
                          <img src={chart.thumbnails[0].url} alt={chart.title} className='w-14 h-14 rounded-lg object-cover flex-none aspect-square' />
                      </div>
                      {/* Title and artist */}
                      <div className='flex flex-col gap-1 justify-center '>
                          <h1 className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-gray-200'} line-clamp-1 z-20`}>{chart.title}</h1>
                          <p className='text-gray-400 text-sm line-clamp-1'>{chart.artists.map((artist) => artist.name).join(', ')}</p>
                      </div>
                  </div>
                  {/* More button */}
                  {
                    isAuthenticated &&
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(chart)}} className='relative z-40 cursor-pointer shrink-0 p-1 hover:bg-gray-200/10 rounded-full h-fit'>
                      <MoreHorizontal size={20} className='text-white hover:text-white' />
                      {
                        showDropdown(chart) &&
                        <div className=' absolute z-[100]  right-7 bottom-0 origin-bottom'>
                            <DropDown />
                        </div>
                      }
                  </button>
                  }

                </div>
            )})
         }

          </div>
        </div>
        
        <Toaster position='bottom-right' />
    </div>
  )
}

export default TopCharts