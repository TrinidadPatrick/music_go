import React, { useEffect, useRef, useState } from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import SelectedDropdown from './SelectedDropdown'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import http from '../../../http'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SpinnerLoader from '../../Components/SpinnerLoader'

const PlaylistsTab = () => {
        const navigate = useNavigate()
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

            navigate(`/public/playlist?list=${track.browseId}`)
        }

        const getAllSongs = async (step, query) => {
            const thisFetchId = ++fetchIdRef.current;
            let fetch_results = [];
            let limit = 20;

            // Used loop incase i want to increase step in future
            while(step <= 2){
                
                try {
                    setFethchedAllSongs(false)
                    const results = await http.get(`/music/search?q=${query}&filter=playlists&limit=${limit}`)
                    const data = results.data;
                    if (thisFetchId !== fetchIdRef.current) {
                        return;
                    }

                    if (data.length <= fetch_results.length) {
                    break;
                    }

                    const new_data = data.slice(fetch_results.length);
                    fetch_results.push(...new_data);
                    setResults({ playlists: { all: data } });
                    step++
                    limit+=180
                } catch (error) {
                    console.log(error)
                    break;
                } 
            }
            setFethchedAllSongs(true)
        }


      return (
        <div className="space-y-2 flex flex-col flex-1">
            <h2 className="text-2xl font-bold mb-4 text-white">Playlists</h2>
            {(results?.playlists?.all?.length > 0 ? results?.playlists?.all : results?.playlists?.partial)?.map((playlist, index) => {
            return (
                <div onClick={() => handleSelectSong(playlist)} key={index} className={` relative flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group cursor-pointer`}>
                    {
                        selectedItem === playlist &&
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
                            playlist.thumbnails ?
                            <img referrerPolicy='no-referrer' src={playlist.thumbnails[0].url} alt={playlist.title} className="w-full h-full object-cover" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-100">{playlist.title}</p>
                          <div>
                          <p className="text-xs sm:text-sm text-gray-400">{playlist?.author} • {playlist?.itemCount} views</p>
                          </div>
                    </div>

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(playlist)}} className="hidden md:block p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full hover:bg-gray-900">
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


export default PlaylistsTab