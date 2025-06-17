import React, { useEffect, useState } from 'react'
import useHomeContentStore from '../../Stores/HomeContentStore'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useSongDetails from '../../Stores/SongDetailStore';
import toast, { Toaster } from 'react-hot-toast';

const HomeContents = () => {
  const navigate = useNavigate()
  const [selectedDropdown, setSelectedDropdown] = useState(null)
  const {homeContents, getHome} = useHomeContentStore()
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const getSongRecommendation = useGetSongRecommendation(state => state.getSongRecommendation)
  const library = useLibraryStore(state => state.library)
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const getSongDetails = useSongDetails(state => state.getSongDetails)

  useEffect(() => {
    getHome()
  }, [])

  const notify = (message) => toast.success(message);

  const handleSelect = async (track) => {
    if(track?.playlistId){
      navigate(`/public/playlist?list=${track.playlistId}`)
    }else if(track?.type === 'Album' && track?.browseId){
      navigate(`/public/album?list=${track.browseId}`)
    }else if(track?.videoId){
      setCurrentSong(track)
      const songList = await getSongRecommendation(track.videoId)
      if(songList){
        setSongList(songList.tracks)
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
            <li onClick={()=>handleSaveToLibrary(selectedDropdown)} className="hover:bg-gray-700 p-2 rounded">{isSaved(selectedDropdown?.videoId) ? 'Remove from Library' : 'Add to Library'}</li>
          }
          <li className="hover:bg-gray-700 p-2 rounded">Add to Playlist</li>
          <li className="hover:bg-gray-700 p-2 rounded">Share</li>
        </ul>
      </div>
    )
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
      saveToLibrary(songData, notify)
    }
  }

  return (
    <main className='w-full flex flex-col gap-4 p-6'>
      {
        homeContents.length > 0 && homeContents?.map((content, index) => {
          return (
            <div key={index} className='flex flex-col'>
              <div>
                <h2 className='text-2xl font-bold text-white'>{content.title}</h2>
              </div>
              {/* Track lists */}
              <div className='flex gap-3 w-full overflow-auto p-3'>
                {
                  content?.contents?.map((track, index) => {
                    const show = showDropdown(track)
                    return (
                      <div onClick={()=>handleSelect(track)} key={index} className='group cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
                      rounded-2xl p-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 overflow-show 
                      flex-shrink-0 w-60'>

                        {/* more button */}
                        <button onClick={(e)=>{e.stopPropagation();handleMoreOption(track)}} className='md:hidden md:group-hover:block hover:bg-gray-500 hover:rounded-full p-1 cursor-pointer absolute right-5 z-50'>
                                  <MoreHorizontal size={20} className='text-white  z-10 relative ' />
                                  {
                                    showDropdown(track) &&
                                    <DropDown />
                                  }
                        </button>

                        <button className='p-3 hidden group-hover:flex rounded-full bg-white absolute z-40 left-1/2 transform -translate-x-1/2 top-24'>
                                <Play  className='text-gray-700 flex items-center justify-center cursor-pointer transition-transform duration-200' />
                        </button>
                    
                        {/* Hover overlay */}
                        <div className='hidden group-hover:block w-full h-full opacity-50 brightness-0 z-20 bg-black absolute top-0 left-0'>
                        </div>
                    
                        {/* Image and Playbutton */}
                        <div className='w-full flex items-center justify-center aspect-square bg-cover bg-center opacity-75 bg-no-repeat rounded-lg' style={{backgroundImage: `url(${track?.thumbnails[1]?.url || track?.thumbnails[0]?.url})`}}>
                            
                        </div>

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
          )
        })
      }
      <Toaster position='bottom-right' />
    </main>
  )
}

export default HomeContents