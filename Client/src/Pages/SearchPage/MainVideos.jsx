import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal } from 'lucide-react'
import SelectedDropdown from './SelectedDropdown'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'

const MainVideos = () => {
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const selectedItem = useSearchPageStore( state => state.selectedItem)
    const currentSong = useMusicPlayerStore( state => state.currentSong)
    const setSongList = useMusicPlayerStore( state => state.setSongList)
    const setCurrentSong = useMusicPlayerStore( state => state.setCurrentSong)
    const setIsPlaying = useMusicPlayerStore( state => state.setIsPlaying)
    const setIsLoading = useMusicPlayerStore( state => state.setIsLoading)

    const results = useSearchPageStore( state => state.results)

    const getSongRecommendation = useGetSongRecommendation( state => state.getSongRecommendation)

    const handleMoreOption = (song) => {
        if(song === selectedItem){
            setSelectedItem(null)
        }else{
            setSelectedItem(song)
        }
    }

    const handleSelectSong = async (track) => {
        if (currentSong?.videoId !== track.videoId) {
          setCurrentSong(track)
          setIsPlaying(true)
          setIsLoading(true)
          const songlist = await getSongRecommendation(track.videoId)
          setSongList(songlist.tracks)
        }
    }

  return results?.videos?.partial?.length > 0 && (
    <div className="space-y-2 flex flex-col flex-1">
        <h2 className="text-2xl font-bold mb-4 text-white">Videos</h2>
        <div style={{width : 'calc(100vw - 120px)'}} className=' hide-scrollbar overflow-x-scroll flex gap-3 '>
            {
                results?.videos?.partial?.slice(0, 10)?.map((video, index) => {
                    const thumbnal = video.thumbnails && (video.thumbnails[1]?.url || video.thumbnails[0]?.url)
                    const isCurrentSong = currentSong?.videoId === video.videoId
                    return (
                        <div key={index} onClick={()=>handleSelectSong(video)} className={`${isCurrentSong && 'bg-gray-900'} p-2 rounded group cursor-pointer flex flex-col gap-2 justify-between relative`}>
                            {
                                selectedItem === video &&
                                <div className='absolute -right-1 bottom-35 z-90'>
                                <SelectedDropdown />
                                </div>
                            }
                            {/* Image */}
                            <>
                            <div className='min-w-56 aspect-video bg-red-100 rounded overflow-hidden relative'>
                                {
                                    isCurrentSong &&
                                    <>
                                        <div className='w-full h-full bg-black absolute opacity-65 flex items-center justify-center' />
                                        {/* Center this */}
                                        <div className='absolute h-[40px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                        <EqualizerAnimation />
                                        </div>
                                    </>
                                }
                                <img referrerPolicy='no-referrer' src={thumbnal} alt={video.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Title and artists */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm line-clamp-2 font-medium text-gray-100">{video.title}</p>
                                <p className="text-sm text-gray-400">{video.artists ? video.artists.map((artist) => artist.name).join(', ') : ''}</p>
                            </div>
                            </>

                            {/* More button */}
                            <div className='w-full flex gap-2 items-center'>
                            <span className='text-gray-400 text-sm w-full'>
                                {video?.duration} • {video?.views} views
                            </span>
                            <button onClick={(e)=>{e.stopPropagation();handleMoreOption(video)}} className="w-fit p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full hover:bg-gray-900">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button>
                            </div>
                        </div>
                    )})
            }
        </div>
    </div>
  )
}

export default MainVideos