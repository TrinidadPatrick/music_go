import React, { useEffect, useState } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import useChartsStore from '../../Stores/TopChartsStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import http from '../../../http';
import useSongDetails from '../../Stores/SongDetailStore';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../Auth/AuthProvider';

const TopCharts = () => {
    const {charts, getCharts} = useChartsStore()
    const {isAuthenticated} = useAuth()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
    const library = useLibraryStore(state => state.library)
    const getSongDetails = useSongDetails(state => state.getSongDetails)
    const [selectedDropdown, setSelectedDropdown] = useState(null)

    useEffect(() => {
        getCharts()
    }, [])

    const notify = (message) => toast.success(message);

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
          saveToLibrary(songData, notify)
        }
    }

    const handleSelectSong = (track) => {
        if(currentSong?.videoId !== track.videoId){
          setCurrentSong(track)
          setIsLoading(true)
        }
    }

    const DropDown = () => {
        return (
          <div className=" w-48 bg-gray-800 rounded-lg shadow-lg z-[100]">
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

  return charts?.length > 0 && (
     <div className='w-full h-full flex flex-col gap-4 p-6'>

        <div className='flex-shrink-0'>
            <h2 className='text-2xl font-bold text-white'>Top Charts</h2>
        </div>
        
        <div className='flex-1 min-h-0  '>
          <div className='grid grid-cols-2 gap-3 p-4'>
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
                  <div className='flex gap-3 flex-1 min-w-0'>
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