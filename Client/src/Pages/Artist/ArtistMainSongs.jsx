import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { MoreHorizontal, Play } from 'lucide-react'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'
import ArtistSelectedDropdown from './ArtistSelectedDropdown'

const ArtistMainSongs = () => {
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

  return artistData?.songs?.partial?.length > 0 && (
    <div className="flex flex-col flex-1 space-y-2">
        <h2 className="mb-4 text-2xl font-bold text-white">Songs</h2>
        <div  className='flex flex-col gap-3 overflow-x-scroll hide-scrollbar'>
            {
                artistData?.songs?.partial?.map((song, index) => {
                    const thumbnal = song.thumbnails && (song.thumbnails[1]?.url || song.thumbnails[0]?.url)
                    const isCurrentSong = currentSong?.videoId === song.videoId
                    return (
                        <div onClick={(e) => {e.stopPropagation(); handleSelectSong(song)}} key={index} className={`${isCurrentSong && 'bg-gray-800'} relative flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group cursor-pointer`}>
                        {
                            selectedItem === song &&
                            <div className='absolute top-0 right-56'>
                            <SelectedDropdown />
                            </div>
                        }
                        {/* Number */}
                        <div className="justify-center hidden w-10 text-center md:flex">
                              {
                                !isCurrentSong &&
                                <span className="text-sm text-gray-400 group-hover:hidden">{index + 1}</span>
                              }
                              <button className={`${isCurrentSong ? '' : 'hidden'} group-hover:block `}>
                                <Play className="w-5 h-5" fill="white" />
                              </button>
                        </div>
    
                        {/* Image */}
                        <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-700 rounded sm:w-12 sm:h-12">
                            {
                                isCurrentSong &&
                                <>
                                    <div className='absolute flex items-center justify-center w-full h-full bg-black opacity-65' />
                                    <div className='absolute h-6'>
                                    <EqualizerAnimation />
                                    </div>
                                </>
                            }
                            {
                                song.thumbnails ?
                                <img referrerPolicy='no-referrer' src={song.thumbnails[0].url} alt={song.title} className="object-cover w-full h-full" />
                                :
                                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                            }
                        </div>
    
                        {/* Title and artists */}
                        <div className="flex-1">
                              <p className="text-xs font-medium text-gray-100 sm:text-sm line-clamp-1">{song.title}</p>
                              <p className="text-xs text-gray-400 sm:text-sm">{song.artists ? song.artists.map((artist) => artist.name).join(', ') : ''}</p>
                        </div>
    
                        {/* Album */}
                        <div className="hidden text-sm text-gray-400 md:block">
                              {song.album ? song.album.name : ''}
                        </div>
                        
                        {/* Duration */}
                        <div className="w-12 text-xs text-right text-gray-400 sm:text-sm">
                              {song.duration}
                        </div>
    
                        {/* More button */}
                        <button onClick={(e)=>{e.stopPropagation();handleMoreOption(song)}} className="hidden p-2 transition-opacity rounded-full cursor-pointer md:block md:opacity-0 group-hover:opacity-100 hover:bg-gray-900">
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    )})
            }
        </div>
    </div>
  )
}

export default ArtistMainSongs