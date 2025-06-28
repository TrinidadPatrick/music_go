import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal } from 'lucide-react'
import SelectedDropdown from './SelectedDropdown'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import { useNavigate } from 'react-router-dom'

const MainArtists = () => {
    const navigate = useNavigate()
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const selectedItem = useSearchPageStore( state => state.selectedItem)

    const results = useSearchPageStore( state => state.results)


    const handleSelect = async (artist) => {
        navigate(`/artist?id=${artist.browseId}`)
    }

  return results?.artists?.partial?.length > 0 && (
    <div className="flex flex-col flex-1 space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-white">Artists</h2>
        <div className='flex gap-3 overflow-x-scroll hide-scrollbar'>
            {
                results?.artists?.partial?.slice(0, 10)?.map((artist, index) => {
                    const thumbnail = artist.thumbnails && (artist.thumbnails[1]?.url || artist.thumbnails[0]?.url)
                    return (
                        <div key={index} onClick={()=>handleSelect(artist)} className={`  p-2 rounded group cursor-pointer flex flex-col gap-2 justify-between relative`}>
                            {
                                selectedItem === artist &&
                                <div className='absolute -right-1 bottom-35 z-90'>
                                <SelectedDropdown />
                                </div>
                            }
                            {/* Image */}
                            <>
                            <div className='relative w-40 overflow-hidden rounded-full hover:brightness-50 min-w-20 sm:min-w-30 md:min-w-40 aspect-square'>
                                <img referrerPolicy='no-referrer' src={thumbnail} alt={artist.title} className="object-cover w-full h-full" />
                            </div>

                            {/* Title and artists */}
                            <div className="flex flex-col gap-2 w-full max-w-[150px]">
                                <p className="text-xs font-medium text-center text-gray-100 break-words md:text-sm">
                                    {artist.artist}
                                </p>
                            </div>

                            </>

                            {/* More button */}
                            <div className='flex items-center w-full gap-2'>
                            {/* <button onClick={(e)=>{e.stopPropagation();handleMoreOption(artist)}} className="p-2 transition-opacity rounded-full opacity-0 cursor-pointer w-fit group-hover:opacity-100 hover:bg-gray-950">
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