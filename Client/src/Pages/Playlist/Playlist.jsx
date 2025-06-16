import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { Heart, Plus, Play, Pause, MoreHorizontal, Clock, Download,Share, ShuffleIcon} from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
  

const Playlist = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const list = params.get('list')
    const {formatTime} = useFormatTimeStore()
    const {getPlaylist, playlist} = usePublicPlaylistStore()
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

    // console.log(playlist)
    
    
  return (
    <div className=" text-white h-full w-full overflow-hidden flex">
        {/* Main Content */}
      <div className="flex-1 h-full p-1 overflow-auto">

        {/* Playlist Header */}
        <div className="bg-gradient-to-b from-green-600 to-green-800 p-8">
        <div className="flex items-end space-x-6">
            <div className="w-48 h-48 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-4xl font-bold">MP</span>
            </div>
            </div>
            
            <div className="flex-1">
            <p className="text-sm font-medium mb-2">PUBLIC PLAYLIST</p>
            <h1 className="text-4xl font-bold mb-4 line-clamp-1">{playlist?.title}</h1>
            <p className="text-gray-200 mb-4">{playlist?.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="font-medium">MusicHub</span>
                <span>•</span>
                <span>{playlist.trackCount} songs</span>
                <span>•</span>
                <span>about {playlist?.duration}</span>
            </div>
            </div>
        </div>
        </div>

        {/* Playlist Controls */}
        <div className=" bg-opacity-60 backdrop-blur-sm p-6">
        <div className="flex items-center space-x-6">
            <button onClick={()=>playAll()} className="w-12 h-12 cursor-pointer bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors hover:scale-105 transform">
            <Play size={20} className="ml-1" />
            </button>
            <button onClick={()=>playAllShuffled()} className="text-gray-400 hover:text-white transition-colors">
            <ShuffleIcon size={25} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
            <Download size={25} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
            <Share size={25} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal size={25} />
            </button>
        </div>
        </div>

        {/* Track List */}
        <div className="px-6 pb-32">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800 mb-4">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-2">Date added</div>
            <div className="col-span-1 flex justify-center">
            <Clock size={16} />
            </div>
        </div>

        {/* Track Rows */}
        <div className="space-y-1">
            {playlist?.tracks?.map((track, index) => (
            <div
                onClick={()=>{handleSelectSong(track)}}
                key={track.videoId}
                className={`${(currentSong?.videoId || "") == track?.videoId && "bg-gray-800"} grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer`}
            >
                <div className="col-span-1 flex items-center">
                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                <button onClick={() => handlePlayPause(track)} className="hidden group-hover:block text-white hover:text-green-400">
                    {(currentSong?.videoId || '') === track.videoId && isPlaying ? (
                    <Pause size={16} />
                    ) : (
                    <Play size={16} />
                    )}
                </button>
                </div>
                
                <div className="col-span-5 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded overflow-hidden">
                    <img src={track.thumbnails[0].url} alt={track.title} className="w-full h-full object-cover" />
                </div>
                <div>
                    <p className={`font-medium ${(currentSong?.videoId || '') === track.videoId ? 'text-green-400' : 'text-white'} line-clamp-1`}>
                    {track.title}
                    </p>
                    <p className="text-sm text-gray-400">{track.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
                </div>
                
                <div className="col-span-3 flex items-center">
                <p className="text-sm text-gray-400">{track.album ? track.album.name : 'No album'}</p>
                </div>
                
                <div className="col-span-2 flex items-center">
                <p className="text-sm text-gray-400">5 days ago</p>
                </div>
                
                <div className="col-span-1 flex items-center justify-center space-x-2">
                <button onClick={()=>handleSaveSong(track)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                    <Heart size={16} />
                </button>
                <span className="text-sm text-gray-400">{formatTime(track.duration_seconds)}</span>
                <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-all">
                    <MoreHorizontal size={16} />
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
      </div>
      
    </div>
  )
}

export default Playlist