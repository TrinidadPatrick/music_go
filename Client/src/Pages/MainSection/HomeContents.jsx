import React, { useEffect } from 'react'
import useHomeContentStore from '../../Stores/HomeContentStore'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';

const HomeContents = () => {
  const navigate = useNavigate()
  const {homeContents, getHome} = useHomeContentStore()
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const getSongRecommendation = useGetSongRecommendation(state => state.getSongRecommendation)
  const library = useLibraryStore(state => state.library)
  useEffect(() => {
    getHome()
  }, [])

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

  const isSaved = (videoId) => {
    return library.library_songs.some((song) => song.videoId === videoId)
  }

  console.log(library)

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
                    return (
                      <div onClick={()=>handleSelect(track)} key={index} className='group cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
                rounded-2xl p-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 overflow-hidden 
                flex-shrink-0 w-60'>
                    
                    {/* Hover overlay */}
                    <div className='hidden group-hover:block w-full h-full opacity-50 bg-black absolute top-0 left-0'>
                    </div>
                    
                    {/* Image and Playbutton */}
                    <div className='w-full flex items-center justify-center aspect-square bg-cover bg-center bg-no-repeat rounded-lg' style={{backgroundImage: `url(${track?.thumbnails[1]?.url || track?.thumbnails[0]?.url})`}}>
                        <button className='p-3 hidden group-hover:flex rounded-full bg-white z-10'>
                            <Play className='text-black flex items-center justify-center cursor-pointer transition-transform duration-200 shadow-lg' />
                        </button>
                    </div>

                    {/* Title and artists */}
                    <div className='mt-2 flex flex-col gap-1'>
                        <h3 className='text-base text-white line-clamp-2 text-start font-medium'>{track.title}</h3>
                        <p className='text-sm text-gray-400'>{track?.artists && track?.artists.map((artist) => artist?.name).join(', ')}</p>
                    </div>

                    {/* Actions buttons */}
                    <div className='hidden group-hover:flex w-full justify-between mt-5'>
                        <button className='cursor-pointer'>
                            <Heart fill={`${isSaved(track.videoId) ? 'red' : ''}`} size={20} className='text-gray-400 z-10 relative hover:text-red-400' />
                        </button>
                        <button className='cursor-pointer'>
                            <MoreHorizontal size={20} className='text-gray-400 z-10 relative hover:text-gray-600' />
                        </button>
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
    </main>
  )
}

export default HomeContents