import React, { useEffect, useState } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import useChartsStore from '../../Stores/TopChartsStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import http from '../../../http';
import useSongDetails from '../../Stores/SongDetailStore';
import useFormatTimeStore from '../../Stores/FormatTimeStore';

const TopCharts = () => {
    const {charts,getCharts, isLoading, error} = useChartsStore()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)

    useEffect(() => {
        getCharts()
    }, [])


  return charts?.length > 0 && (
     <div className='w-full h-fit max-w-full flex flex-col gap-4 p-6'>
        <div>
            <h2 className='text-2xl font-bold text-white'>Top Charts</h2>
        </div>
        <div className='grid grid-cols-2 gap-3 w-full h-fit p-3'>
            {
            charts?.length > 0 && charts?.map((chart, index) => {
                // console.log(Number(chart?.songDetail?.lengthSeconds))
                return (
                <div onClick={()=>{setCurrentSong(chart);setIsLoading(true)}} key={index} className='group w-full cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
                rounded-2xl p-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 
                flex gap-3 justify-between
                flex-shrink-0'>
                    
                    {/* Hover overlay */}
                    <div className='hidden group-hover:block w-full h-full opacity-50 bg-black absolute top-0 left-0'>
                    </div>
                    
                    <div className='flex gap-3 flex-1 min-w-0'>
                    <div className='flex gap-3 items-center h-full'>
                        <span className='text-gray-200'>{index + 1}</span>
                    </div>
                    {/* Image */}
                    <div className='flex-none'>
                        <img src={chart.thumbnails[0].url} alt={chart.title} className='w-14 h-14 rounded-lg object-cover flex-none aspect-square' />
                    </div>

                    {/* Title and artist */}
                    <div className='flex flex-col gap-1 justify-center '>
                        <h1 className='font-medium text-gray-200 line-clamp-1'>{chart.title}</h1>
                        <p className='text-gray-400 text-sm line-clamp-1'>{chart.artists.map((artist) => artist.name).join(', ')}</p>
                    </div>
                    </div>

                    {/* More button */}
                    <button className=' shrink-0'>
                        <MoreHorizontal size={20} className='text-gray-400 hover:text-white' />
                    </button>


                </div>
            )})
         }
        </div>
    </div>
  )
}

export default TopCharts