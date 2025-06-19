import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { Heart, Plus, Play, Pause, MoreHorizontal, Clock, Download,Share, ShuffleIcon, Music, PlayIcon} from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import useSaveToLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useScreenSize from '../../Auth/ScreenSizeProvider';
  

const Playlist = () => {
    const navigate = useNavigate()
    const {width} = useScreenSize()
    const [params] = useSearchParams()
    const list = params.get('list')
    const {formatTime} = useFormatTimeStore()
    const {getPlaylist, playlist, isLoading} = usePublicPlaylistStore()
    const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const isPlaying = useMusicPlayerStore(state => state.isPlaying)
    const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
    const setSongList = useMusicPlayerStore(state => state.setSongList)
    const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)

    useEffect(()=>{
        getPlaylist(list, navigate)
    }, [])

    const playAll = () => {
        setSongList(playlist.tracks)
        setCurrentSong(playlist.tracks[0])
    }

    const playAllShuffled = () => {
        const index = Math.floor(Math.random() * playlist.tracks.length);
        setSongList(playlist.tracks)
        setCurrentSong(playlist.tracks[index])
        toggleShuffle()
    }
    
    const handlePlayPause = (track) => {
        if (currentSong?.videoId === track.videoId) {
          setIsPlaying(!isPlaying);
        } else {
          setCurrentSong(track);  // This already sets isLoading, currentTime, etc.
          setIsPlaying(true);
        }
    };

    const handleSelectSong = (track) => {
        setSongList(playlist.tracks)
        setCurrentSong(track)
        setIsPlaying(true)
        setIsLoading(true)
    }

    const handleSaveSong = (track) => {
        saveToLibrary(track)
    }

    const Loader = () => {
        return (
            <div className="bg-gray-900 text-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-600 px-6 py-6 md:px-8 md:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
          {/* Album Art Skeleton */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-700/70 rounded-lg animate-pulse"></div>
          </div>
          
          {/* Playlist Info Skeleton */}
          <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
            {/* Title */}
            <div className="h-8 sm:h-10 md:h-12 bg-gray-600/70 rounded animate-pulse w-full max-w-xs"></div>
            
            {/* Subtitle Info */}
            <div className="space-y-2">
              <div className="h-3 md:h-4 bg-gray-600/70 rounded animate-pulse w-40 sm:w-48"></div>
            </div>
            
            {/* Control Buttons Skeleton */}
            <div className="flex items-center gap-4 pt-2 md:pt-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-600/70 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Song List Section */}
      <div className="px-4 py-6 md:px-8">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-700 mb-4">
          <div className="col-span-1">#</div>
          <div className="col-span-6 md:col-span-7">TITLE</div>
          <div className="hidden md:block col-span-3">DATE ADDED</div>
          <div className="col-span-5 md:col-span-1 text-right">
            <div className="w-4 h-4 bg-gray-600 rounded animate-pulse ml-auto"></div>
          </div>
        </div>
        
        {/* Song Rows Skeleton */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800 rounded-lg group">
            {/* Track Number */}
            <div className="col-span-1 flex items-center">
              <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
            </div>
            
            {/* Song Info */}
            <div className="col-span-6 md:col-span-7 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-700 rounded animate-pulse flex-shrink-0"></div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="h-4 bg-gray-600 rounded animate-pulse w-full max-w-xs"></div>
                <div className="h-3 bg-gray-700 rounded animate-pulse w-20"></div>
              </div>
            </div>
            
            {/* Date Added (Hidden on mobile) */}
            <div className="hidden md:flex col-span-3 items-center">
              <div className="h-4 bg-gray-600 rounded animate-pulse w-24"></div>
            </div>
            
            {/* Duration */}
            <div className="col-span-5 md:col-span-1 flex items-center justify-end">
              <div className="h-4 bg-gray-600 rounded animate-pulse w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
        )
    }
    
    
  return (
    <div className=" text-white h-full w-full overflow-hidden flex px-5">
        {
            playlist?.tracks?.length === 0 ? <Loader />
            :
            <div className="flex-1 h-full overflow-auto">

            {/* Playlist Header */}
            <div className="bg-gradient-to-br from-green-600 via-blue-900 to-indigo-900 p-3 sm:p-8 rounded sm: h-fith-60 flex w-full">
            <div className="flex flex-row items-center sm:items-end gap-6 w-full">
                <div style={{backgroundImage: `url(${playlist?.thumbnails ? (playlist?.thumbnails[1]?.url || playlist?.thumbnails[0]?.url) : ''})`}} className="h-full aspect-square hidden sm:w-44 sm:h-44  rounded-lg shadow-2xl sm:flex items-center bg-cover justify-center"> 
                </div>
                
                <div className="h-full w-full justify-center sm:justify-end flex flex-col gap-4">
                    {/* Title */}
                    <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1">{playlist?.title}</p>
                    {/* Additional Info */}
                    <div className="flex flex-row items-start sm:items-center space-x-2 text-sm text-gray-300">
                        <span className='hidden sm:block text-green-500'>•</span>
                        <span>{playlist?.trackCount} songs</span>
                        <span className='hidden sm:block'>•</span>
                        <span>about {playlist?.duration}</span>
                    </div>
                    {/* Controls */}
                    <div className="flex items-center space-x-3">
                        <button onClick={()=>playAll()} className="w-12 h-12 cursor-pointer bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors hover:scale-105 transform">
                            <Play size={20} className="ml-1" />
                        </button>
                        <button onClick={()=>playAllShuffled()} className="text-white bg-white/10 p-2 rounded-full hover:text-white transition-colors">
                            <ShuffleIcon size={20} />
                        </button>
                    </div>
                </div>
            </div>
            </div>
    
    
            {/* Track List */}
            <div className="px-4 sm:px-6 mt-10">
            {/* Table Header – Hidden on mobile */}
            <div className="hidden sm:grid grid-cols-11 md:grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800 mb-4">
                <div className="col-span-1">#</div>
                <div className="col-span-8">Title</div>
                {/* <div className="hidden md:block col-span-2">Date added</div> */}
                <div className="col-span-1 flex justify-center">
                <Clock size={16} />
                </div>
                <div className="col-span-1 flex justify-center">
                </div>
            </div>
    
            {/* Track Rows */}
            <div className="space-y-1">
                {playlist?.tracks?.map((track, index) => (
                    <div
                    onClick={() => handleSelectSong(track)}
                    key={track.videoId}
                    className={`${
                        (currentSong?.videoId || "") === track?.videoId ? "bg-gray-800" : ""
                    } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-2 sm:px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
                    >
                    {/* Index - hidden on mobile */}
                    <div className="hidden sm:flex items-center col-span-1">
                        <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPause(track);
                        }}
                        className="hidden group-hover:block text-white hover:text-green-400"
                        >
                        {(currentSong?.videoId || "") === track.videoId && isPlaying ? (
                            <Pause size={16} />
                        ) : (
                            <Play size={16} />
                        )}
                        </button>
                    </div>
    
                    {/* Title – always visible */}
                    <div className="col-span-10 sm:col-span-8 md:col-span-8 flex items-center space-x-3 min-w-0">
                        <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden sm:block hidden">
                            <img src={track.thumbnails[0].url} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                        <p
                            className={`font-medium ${
                            (currentSong?.videoId || "") === track.videoId
                                ? "text-green-400"
                                : "text-white"
                            } line-clamp-1 text-sm sm:text-base`}
                        >
                            {track.title}
                        </p>
    
                        {/* Artist – hidden on small screens */}
                        <p className=" text-xs sm:text-sm text-gray-400 truncate">
                            {track.artists.map((artist) => artist.name).join(', ')}
                        </p>
                        </div>
                    </div>
    
                    {/* Date added – hidden on mobile */}
                    {/* <div className="hidden md:flex col-span-2 items-center">
                        <p className="text-sm text-gray-400">5 days ago</p>
                    </div> */}
    
                    {/* Duration & Heart – only More shown on mobile */}
                    <div className="col-span-1 flex items-center justify-center md:justify-center space-x-2">
                        <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSaveSong(track);
                        }}
                        className="text-gray-400 hidden md:group-hover:flex justify-center items-center hover:text-white transition-all group-hover:opacity-100"
                        >
                        <Heart size={16} />
                        </button>
                        <p className="hidden sm:block text-sm text-gray-400">
                        {formatTime(track.duration_seconds)}
                        </p>
                        <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hidden md:group-hover:flex justify-center items-center hover:text-white transition-all group-hover:opacity-100"
                        >
                        <MoreHorizontal size={16} />
                        </button>
                    </div>
    
                    {/* More */}
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 md:hidden flex justify-center items-center hover:text-white transition-all group-hover:opacity-100"
                        >
                        <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
            </div>
            </div>
    
    
          </div>
        }
    </div>
  )
}

export default Playlist