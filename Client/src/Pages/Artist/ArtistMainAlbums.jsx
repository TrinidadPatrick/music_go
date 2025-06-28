import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal } from 'lucide-react'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'
import ArtistSelectedDropdown from './ArtistSelectedDropdown'
import { useNavigate } from 'react-router-dom'

const ArtistMainAlbums = () => {
    const navigate = useNavigate()
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
        navigate(`/public/album?list=${track.browseId}`)
    }

  return artistData?.albums?.partial?.length > 0 && (
    <div className="flex flex-col flex-1 space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-white">Albums</h2>
        <div  className='flex flex-col gap-3 overflow-x-scroll hide-scrollbar'>
            {
                artistData?.albums?.partial?.map((album, index) => {
                    const thumbnaill = album.thumbnails && (album.thumbnails[1]?.url || album.thumbnails[0]?.url)
                    return (
                        <div onClick={() => handleSelectSong(album)} key={index} className={` relative flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group cursor-pointer`}>
                    {
                        selectedItem === album &&
                        <div className='absolute top-0 right-56'>
                        <ArtistSelectedDropdown />
                        </div>
                    }
                    {/* Number */}
                    <div className="justify-center hidden w-10 text-center md:flex">
                          <button className={` text-gray-400 text-sm `}>
                            {
                                index + 1
                            }
                          </button>
                    </div>

                    {/* Image */}
                    <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-700 rounded sm:w-12 sm:h-12">
                        {
                            album.thumbnails ?
                            <img referrerPolicy='no-referrer' src={thumbnaill} alt={album.title} className="object-cover w-full h-full" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className="text-xs font-medium text-gray-100 sm:text-sm">{album.title}</p>
                          <p className="text-xs text-gray-400 sm:text-sm">{album.type || ''}</p>
                    </div>

                

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(album)}} className="p-2 transition-opacity rounded-full opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-gray-900">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                    )})
            }
        </div>
    </div>
  )
}

export default ArtistMainAlbums