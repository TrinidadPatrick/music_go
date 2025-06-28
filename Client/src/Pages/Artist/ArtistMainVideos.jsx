import React, { useEffect } from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal } from 'lucide-react'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'
import ArtistSelectedDropdown from './ArtistSelectedDropdown'

const ArtistMainVideos = () => {
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const selectedItem = useSearchPageStore( state => state.selectedItem)
    const currentSong = useMusicPlayerStore( state => state.currentSong)
    const setSongList = useMusicPlayerStore( state => state.setSongList)
    const setCurrentSong = useMusicPlayerStore( state => state.setCurrentSong)
    const setIsPlaying = useMusicPlayerStore( state => state.setIsPlaying)
    const setIsLoading = useMusicPlayerStore( state => state.setIsLoading)

    const artistData = useArtistDetailStore( state => state.artistData)

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

  return artistData?.videos?.partial?.length > 0 && (
    <div className="flex flex-col flex-1 space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-white">Videos</h2>
        <div  className='flex gap-3 overflow-x-scroll hide-scrollbar'>
            {
                artistData?.videos?.partial?.map((video, index) => {
                    const thumbnal = video.thumbnails && (video.thumbnails[1]?.url || video.thumbnails[0]?.url)
                    const isCurrentSong = currentSong?.videoId === video.videoId
                    return (
                        <div key={index} onClick={()=>handleSelectSong(video)} className={`${isCurrentSong && 'bg-gray-900'} z-10 h-full p-2 rounded cursor-pointer flex flex-col gap-1 md:gap-2 justify-between relative`}>
                            
                            <div className='relative z-10 group'>
                                {/* Image */}
                                <div className='flex-none overflow-hidden rounded group-hover:brightness-50 min-w-40 md:min-w-56 aspect-video'>
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
                                </div>

                                {/* More button */}
                                <button onClick={(e)=>{e.stopPropagation();handleMoreOption(video)}} className="hidden group-hover:block absolute z-50 p-1.5 transition-opacity rounded-full cursor-pointer top-2 right-3 w-fit hover:bg-white/10">
                                    <MoreHorizontal className="w-5 h-5 text-white" />
                                </button>

                                {
                                selectedItem === video &&
                                <div className='absolute origin-left top-10 right-56 z-90'>
                                <ArtistSelectedDropdown />
                                </div>
                                }

                            </div>

                            {/* Title and artists */}
                            <div className="flex flex-col h-full md:gap-1">
                                <p className="text-sm font-medium text-gray-100 line-clamp-2">{video.title}</p>
                                <p className="text-xs text-gray-400 md:text-sm">{video.artists ? video.artists.map((artist) => artist.name).join(', ') : ''} • {video?.views} views</p>
                            </div>

                            </div>
                    )})
            }
        </div>
    </div>
  )
}

export default ArtistMainVideos