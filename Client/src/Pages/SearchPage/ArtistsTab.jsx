import React, { useEffect, useRef, useState } from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import SelectedDropdown from './SelectedDropdown'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import http from '../../../http'
import { useSearchParams } from 'react-router-dom'
import SpinnerLoader from '../../Components/SpinnerLoader'

const ArtistsTab = () => {
        const [params, setParams] = useSearchParams()
        const q = params.get('q') || ''
        const fetchIdRef = useRef(0);
        const selectedItem = useSearchPageStore( state => state.selectedItem)
        const currentSong = useMusicPlayerStore( state => state.currentSong)
        const setSongList = useMusicPlayerStore( state => state.setSongList)
        const setCurrentSong = useMusicPlayerStore( state => state.setCurrentSong)
        const setIsPlaying = useMusicPlayerStore( state => state.setIsPlaying)
        const setIsLoading = useMusicPlayerStore( state => state.setIsLoading)

        const getSongRecommendation = useGetSongRecommendation( state => state.getSongRecommendation)

        const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
        const activeTab = useSearchPageStore( state => state.activeTab)
        const results = useSearchPageStore( state => state.results)
        const setResults = useSearchPageStore( state => state.setResults)

        const [fethchedAllSongs, setFethchedAllSongs] = useState(false)

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

        const getAllVideos = async (step, query) => {
            const thisFetchId = ++fetchIdRef.current;
            let fetch_results = [];
            let limit = 200;

            // Used loop incase i want to increase step in future
            while(step <= 1){
                
                try {
                    setFethchedAllSongs(false)
                    const results = await http.get(`/music/search?q=${query}&filter=artists&limit=${limit}`)
                    const data = results.data;

                    if (thisFetchId !== fetchIdRef.current) {
                        return;
                    }

                    if (data.length <= fetch_results.length) {
                    break;
                    }

                    const new_data = data.slice(fetch_results.length);
                    fetch_results.push(...new_data);
                    setResults({ artists: { all: data } });
                    step++
                    limit+=50
                } catch (error) {
                    console.log(error)
                    break;
                } 
            }
            setFethchedAllSongs(true)
        }

        // useEffect(()=>{
        //     if(activeTab === 'artists'){
        //         getAllVideos(1, q)
        //     }
        // }, [activeTab, q])


      return (
        <div className="space-y-2 flex flex-col flex-1">
            {(results?.artists?.all?.length > 0 ? results?.artists?.all : results?.artists?.partial)?.map((artist, index) => {
            const isCurrentSong = currentSong?.videoId === artist.videoId
            return (
                <div onClick={() => handleSelectSong(artist)} key={index} className={`${isCurrentSong && 'bg-gray-800'} relative flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group cursor-pointer`}>
                    {
                        selectedItem === artist &&
                        <div className='absolute right-56 top-5'>
                        <SelectedDropdown />
                        </div>
                    }
                    {/* Number */}
                    <div className="hidden w-10 text-center md:flex justify-center">
                          {
                            !isCurrentSong &&
                            <span className="text-gray-400 text-sm group-hover:hidden">{index + 1}</span>
                          }
                          <button className={`${isCurrentSong ? '' : 'hidden'} group-hover:block `}>
                            <Play className="w-5 h-5" fill="white" />
                          </button>
                    </div>

                    {/* Image */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded overflow-hidden flex items-center justify-center relative">
                        {
                            isCurrentSong &&
                            <>
                                <div className='w-full h-full bg-black absolute opacity-65 flex items-center justify-center' />
                                <div className='absolute h-6'>
                                <EqualizerAnimation />
                                </div>
                            </>
                        }
                        {
                            artist.thumbnails ?
                            <img referrerPolicy='no-referrer' src={artist.thumbnails[0].url} alt={artist.artist} className="w-full h-full object-cover" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-100">{artist.artist}</p>
                    </div>

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(artist)}} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full hover:bg-gray-900">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            )})}
            {
                !fethchedAllSongs && 
                <div className='w-full flex justify-center'>
                    <SpinnerLoader />
                </div>
            }
        </div>
      )
    }


export default ArtistsTab