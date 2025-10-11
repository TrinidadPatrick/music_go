import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { Heart, Plus, Play, Pause, MoreHorizontal, Clock, Download,Share, ShuffleIcon, Music, PlayIcon} from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import usePublicAlbumStore from '../../Stores/PublicAlbumStore';
import useScreenSize from '../../Auth/ScreenSizeProvider';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
  

const Album = () => {
    const navigate = useNavigate()
    const {width} = useScreenSize()
    const [params] = useSearchParams()
    const list = params.get('list')
    const {formatTime} = useFormatTimeStore()
    const {getAlbum, album} = usePublicAlbumStore()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const isPlaying = useMusicPlayerStore(state => state.isPlaying)
    const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
    const setSongList = useMusicPlayerStore(state => state.setSongList)
    const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)
    const library = useLibraryStore(state => state.library)
    const saveToLibrary = useLibraryStore(state => state.saveToLibrary)

    const isSaved = (videoId) => {
        return library?.library_songs?.some((song) => song.videoId === videoId)
    }

    useEffect(()=>{
        getAlbum(list, navigate)
    }, [])

    const playAll = () => {
        setSongList(album.tracks)
        setCurrentSong(album.tracks[0])
    }

    const playAllShuffled = () => {
        const index = Math.floor(Math.random() * album.tracks.length);
        setSongList(album.tracks)
        setCurrentSong(album.tracks[index])
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
        setSongList(album.tracks)
        setCurrentSong(track)
        setIsPlaying(true)
        setIsLoading(true)
    }

    const handleSaveSong = (track) => {
        saveToLibrary(track)
    }
    
    
  return (
    <div className="flex w-full h-full px-5 overflow-hidden text-white ">
        {/* Main Content */}
      <div className="flex-1 h-full overflow-auto">

        {/* Album Header */}
        <div className="flex w-full p-3 rounded bg-gradient-to-br from-green-600 via-blue-900 to-indigo-900 sm:p-8 sm: h-fith-60">
        <div className="flex flex-row items-center w-full gap-6 sm:items-end">
            <div 
                style={{backgroundImage: `url(${ album?.thumbnails ? (album?.thumbnails[2]?.url || album?.thumbnails[1]?.url || album?.thumbnails[0]?.url) : ''})`}} 
                className="items-center justify-center hidden h-full bg-gray-800 bg-cover rounded-lg shadow-2xl aspect-square sm:w-44 sm:h-44 sm:flex"
            > 
            </div>
            
            <div className="flex flex-col justify-center w-full h-full gap-4 sm:justify-end">
                {/* Title */}
                <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1">{album?.title}</p>
                {/* Additional Info */}
                <div className="flex flex-row items-start space-x-2 text-sm text-gray-300 sm:items-center">
                    <span className='hidden text-green-500 sm:block'>•</span>
                    <span>{album?.trackCount} songs</span>
                    <span className='hidden sm:block'>•</span>
                    <span>about {album?.duration}</span>
                </div>
                {/* Controls */}
                <div className="flex items-center space-x-3">
                    <button onClick={()=>playAll()} className="flex items-center justify-center w-12 h-12 transition-colors transform bg-green-500 rounded-full cursor-pointer hover:bg-green-400 hover:scale-105">
                        <Play size={20} className="ml-1" />
                    </button>
                    <button onClick={()=>playAllShuffled()} className="p-2 text-white transition-colors rounded-full bg-white/10 hover:text-white">
                        <ShuffleIcon size={20} />
                    </button>
                </div>
            </div>
        </div>
        </div>


        {/* Track List */}
        <div className="px-4 mt-10 sm:px-6">
        {/* Table Header – Hidden on mobile */}
        <div className="hidden grid-cols-11 gap-4 px-4 py-2 mb-4 text-xs tracking-wide text-gray-400 uppercase border-b border-gray-800 sm:grid md:grid-cols-12">
            <div className="col-span-1">#</div>
            <div className="col-span-8">Title</div>
            <div className="flex justify-center col-span-1">
            <Clock size={16} />
            </div>
            <div className="flex justify-center col-span-1">
            </div>
        </div>

        {/* Track Rows */}
        <div className="space-y-1">
            {album?.tracks?.map((track, index) => {
                return (
                <div
                onClick={() => handleSelectSong(track)}
                key={track.videoId}
                className={`${
                    (currentSong?.videoId || "") === track?.videoId ? "bg-gray-800" : ""
                } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-2 sm:px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
                >
                {/* Index - hidden on mobile */}
                <div className="items-center hidden col-span-1 sm:flex">
                    <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPause(track);
                    }}
                    className="hidden text-white group-hover:block hover:text-green-400"
                    >
                    {(currentSong?.videoId || "") === track.videoId && isPlaying ? (
                        <Pause size={16} />
                    ) : (
                        <Play size={16} />
                    )}
                    </button>
                </div>

                {/* Title – always visible */}
                <div className="flex items-center min-w-0 col-span-10 space-x-3 sm:col-span-8 md:col-span-8">
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
                    <p className="text-xs text-gray-400 truncate sm:text-sm">
                        {track.artists.map((artist) => artist.name).join(', ')}
                    </p>
                    </div>
                </div>

                {/* Duration & Heart – only More shown on mobile */}
                <div className="flex items-center justify-center col-span-1 space-x-2 md:justify-center">
                    {/* <button
                    onClick={(e) => {e.stopPropagation(); handleSaveSong(track)}}
                    className="items-center justify-center hidden text-gray-400 transition-all md:group-hover:flex hover:text-white group-hover:opacity-100"
                    >
                    <Heart fill={`${isSaved(track.videoId) ? 'white' : ''}`} size={16} />
                    </button> */}
                    <p className="hidden text-sm text-gray-400 sm:block">
                    {formatTime(track.duration_seconds)}
                    </p>
                    {/* <button
                    onClick={(e) => e.stopPropagation()}
                    className="items-center justify-center hidden text-gray-400 transition-all md:group-hover:flex hover:text-white group-hover:opacity-100"
                    >
                    <MoreHorizontal size={16} />
                    </button> */}
                </div>

                {/* More */}
                {/* <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center text-gray-400 transition-all md:hidden hover:text-white group-hover:opacity-100"
                    >
                    <MoreHorizontal size={16} />
                </button> */}
                </div>
            )})}
        </div>
        </div>


      </div>
      
    </div>
  )
}

export default Album