import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal } from 'lucide-react'
import SelectedDropdown from './SelectedDropdown'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'

const MainArtists = () => {
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

  return results?.artists?.partial?.length > 0 && (
    <div className="space-y-2 flex flex-col flex-1">
        <h2 className="text-2xl font-bold mb-4 text-white">Artists</h2>
        <div className=' hide-scrollbar overflow-x-scroll flex gap-3 '>
            {
                results?.artists?.partial?.slice(0, 10)?.map((artist, index) => {
                    const thumbnal = artist.thumbnails && (artist.thumbnails[1]?.url || artist.thumbnails[0]?.url)
                    return (
                        <div key={index} onClick={()=>handleSelectSong(artist)} className={` p-2 rounded group cursor-pointer flex flex-col gap-2 justify-between relative`}>
                            {
                                selectedItem === artist &&
                                <div className='absolute -right-1 bottom-35 z-90'>
                                <SelectedDropdown />
                                </div>
                            }
                            {/* Image */}
                            <>
                            <div className='min-w-20 sm:min-w-30 md:min-w-40 aspect-square  rounded-full overflow-hidden relative'>
                                <img referrerPolicy='no-referrer' src={thumbnal} alt={artist.title} className="w-full h-full object-cover" />
                            </div>

                            {/* Title and artists */}
                            <div className="flex flex-col gap-2">
                                <p className="text-xs md:text-sm line-clamp-2 font-medium text-gray-100 text-center">{artist.artist}</p>
                            </div>
                            </>

                            {/* More button */}
                            <div className='w-full flex gap-2 items-center'>
                            {/* <button onClick={(e)=>{e.stopPropagation();handleMoreOption(artist)}} className="w-fit p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full hover:bg-gray-950">
                                <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </button> */}
                            </div>
                        </div>
                    )})
            }
        </div>
    </div>
  )
}

export default MainArtists