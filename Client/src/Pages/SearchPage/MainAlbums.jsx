import React from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import SelectedDropdown from './SelectedDropdown'
import { useNavigate } from 'react-router-dom'

const MainAlbums = () => {
        const navigate = useNavigate()
        const selectedItem = useSearchPageStore( state => state.selectedItem)

        const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
        const results = useSearchPageStore( state => state.results)


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

        
    return results.albums?.partial?.length > 0 && (
        <div className="space-y-2 flex flex-col flex-1">
            <h2 className="text-2xl font-bold mb-4 text-white">Albums</h2>
            {results?.albums?.partial?.slice(0,10)?.map((album, index) => {
            return (
                <div onClick={() => handleSelectSong(album)} key={index} className={` relative flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary/20 group cursor-pointer`}>
                    {
                        selectedItem === album &&
                        <div className='absolute right-56 top-0'>
                        <SelectedDropdown />
                        </div>
                    }
                    {/* Number */}
                    <div className="hidden w-10 text-center md:flex justify-center">
                          <button className={` text-gray-400 text-sm `}>
                            {
                                index + 1
                            }
                          </button>
                    </div>

                    {/* Image */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded overflow-hidden flex items-center justify-center relative">
                        {
                            album.thumbnails ?
                            <img referrerPolicy='no-referrer' src={album.thumbnails[0].url} alt={album.title} className="w-full h-full object-cover" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className=" text-xs sm:text-sm font-medium text-gray-100">{album.title}</p>
                          <p className="text-xs sm:text-sm text-gray-400">{album.artists ? album.artists.map((artist) => artist.name).join(', ') : ''} • {album?.year}</p>
                    </div>

                

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(album)}} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full hover:bg-gray-900">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            )})}
        </div>
      )
}

export default MainAlbums