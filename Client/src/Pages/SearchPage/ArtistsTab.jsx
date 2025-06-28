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

const ArtistsTab = () => {
        const navigate = useNavigate()
        const selectedItem = useSearchPageStore( state => state.selectedItem)


        const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
        const results = useSearchPageStore( state => state.results)

        const showLoading = results?.artists.isFetching === false ? false : results?.artists.isFetching === true && true

        const handleMoreOption = (song) => {
            if(song === selectedItem){
                setSelectedItem(null)
            }else{
                setSelectedItem(song)
            }
        }

        const handleSelect = async (artist) => {
            navigate(`/artist?id=${artist.browseId}`)
        }


      return (
        <div className="flex flex-col flex-1 space-y-2">
            {(results?.artists?.all?.length > 0 ? results?.artists?.all : results?.artists?.partial)?.map((artist, index) => {
            return (
                <div onClick={() => handleSelect(artist)} key={index} className={` relative flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 group cursor-pointer`}>
                    {
                        selectedItem === artist &&
                        <div className='absolute right-56 top-5'>
                        <SelectedDropdown />
                        </div>
                    }
                    {/* Number */}
                    <div className="justify-center hidden w-10 text-center md:flex">
                            <span className="text-sm text-gray-400 group-hover:hidden">{index + 1}</span>
                    </div>

                    {/* Image */}
                    <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-700 rounded sm:w-12 sm:h-12">
                        {
                            artist.thumbnails ?
                            <img referrerPolicy='no-referrer' src={artist.thumbnails[0].url} alt={artist.artist} className="object-cover w-full h-full" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className="text-xs font-medium text-gray-100 sm:text-sm">{artist.artist}</p>
                    </div>

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(artist)}} className="p-2 transition-opacity rounded-full opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-gray-900">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            )})}
            {
                showLoading && 
                <div className='flex justify-center w-full'>
                    <SpinnerLoader />
                </div>
            }
        </div>
      )
    }


export default ArtistsTab