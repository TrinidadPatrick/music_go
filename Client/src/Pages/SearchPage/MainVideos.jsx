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
    <div className="flex flex-col flex-1 space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-white">Videos</h2>
        <div  className='flex gap-3 overflow-x-scroll '>
            {
                results?.videos?.partial?.slice(0, 10)?.map((video, index) => {
                    const thumbnal = video.thumbnails && (video.thumbnails[1]?.url || video.thumbnails[0]?.url)
                    const isCurrentSong = currentSong?.videoId === video.videoId
                    return (
                        <div key={index} onClick={()=>handleSelectSong(video)} className={`${isCurrentSong && 'bg-gray-900'} group  h-full  p-2 rounded group cursor-pointer flex flex-col gap-1 md:gap-2 justify-between relative`}>
                            {
                                selectedItem === video &&
                                <div className='absolute -right-1 bottom-35 z-90'>
                                <SelectedDropdown />
                                </div>
                            }
                            {/* Image */}
                            <>
                            <div className='relative overflow-hidden rounded group-hover:brightness-50 min-w-40 md:min-w-56 md:max-w-56 aspect-video'>
                                {
                                    isCurrentSong &&
                                    <>
                                        <div className='absolute flex items-center justify-center w-full h-full bg-black opacity-65' />
                                        {/* Center this */}
                                        <div className='absolute h-[40px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                        <EqualizerAnimation />
                                        </div>
                                    </>
                                }
                                <img referrerPolicy='no-referrer' src={thumbnal} alt={video.title} className="object-cover w-full h-full" />
                                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs text-foreground">
                                {video.duration}
                                </span>
                            </div>

                            {/* Title and artists */}
                            <div className="flex flex-col md:gap-1">
                                <p className="text-sm font-medium text-gray-100 line-clamp-2">{video.title}</p>
                                <p className="text-xs text-gray-400 md:text-sm">{video.artists ? video.artists.map((artist) => artist.name).join(', ') : ''}</p>
                            </div>
                            </>

                            {/* More button */}
                            <div className='flex items-center w-full gap-2'>
                            <span className='w-full text-xs text-gray-400 md:text-sm'>
                                {video?.views + ' views'}
                            </span>
                            <button onClick={(e)=>{e.stopPropagation();handleMoreOption(video)}} className="p-2 transition-opacity rounded-full opacity-0 cursor-pointer w-fit group-hover:opacity-100 hover:bg-white/10">
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