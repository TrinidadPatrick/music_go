import React, { useEffect, useRef, useState } from 'react'
import { Play, Heart, MoreHorizontal } from 'lucide-react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import SpinnerLoader from '../../Components/SpinnerLoader'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'
import ArtistSelectedDropdown from './ArtistSelectedDropdown'
import http from '../../../http'
import { useNavigate } from 'react-router-dom'

const ArtistAlbumsTab = () => {
    const navigate = useNavigate()
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const selectedItem = useSearchPageStore( state => state.selectedItem)

    const artistData = useArtistDetailStore( state => state.artistData)
    const setArtistData = useArtistDetailStore( state => state.setArtistData)

    const getAllAlbums = async () => {
        try {
            const result = await http.get(`music/artist/albums?channelId=${artistData?.albums?.browseId}&params=${artistData?.albums?.params}`)
            const tracks = result.data
            if(tracks.length > 0){
                setArtistData({albums: {
                    all: tracks,
                }})
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
       if(artistData?.albums?.all?.length === artistData?.albums?.all?.length){
        getAllAlbums()
       }
    }, [])

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


      return (
        <div className="flex flex-col flex-1 space-y-2">
            {artistData?.albums?.all?.map((album, index) => {
            return (
                <div onClick={() => handleSelectSong(album)} key={index} className={` relative flex items-center space-x-4 p-2 rounded-lg hover:bg-secondary/20 group cursor-pointer`}>
                    {
                        selectedItem === album &&
                        <div className='absolute right-56 top-5'>
                        <ArtistSelectedDropdown />
                        </div>
                    }
                    {/* Number */}
                    <div className="justify-center hidden w-10 text-center md:flex">
                            <span className="text-sm text-gray-400 group-hover:hidden">{index + 1}</span>
                    </div>

                    {/* Image */}
                    <div className="relative flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-700 rounded sm:w-12 sm:h-12">
                        {
                            album.thumbnails ?
                            <img referrerPolicy='no-referrer' src={album.thumbnails[0].url} alt={album.title} className="object-cover w-full h-full" />
                            :
                            <div className="w-6 h-6 bg-gray-600 rounded"></div>
                        }
                    </div>

                    {/* Title and artists */}
                    <div className="flex-1">
                          <p className="text-xs font-medium text-gray-100 sm:text-sm">{album.title}</p>
                          <p className="text-xs text-gray-400 sm:text-sm">{album?.type || ''}</p>
                    </div>

                    {/* More button */}
                    <button onClick={(e)=>{e.stopPropagation();handleMoreOption(album)}} className="hidden p-2 transition-opacity rounded-full opacity-0 cursor-pointer md:block group-hover:opacity-100 hover:bg-gray-900">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            )})}
            {/* {
                showLoading && 
                <div className='flex justify-center w-full'>
                    <SpinnerLoader />
                </div>
            } */}
        </div>
      )
    }


export default ArtistAlbumsTab