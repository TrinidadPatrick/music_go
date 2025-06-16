import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { Heart, Plus, Play, Pause, MoreHorizontal, Clock, Download,Share, ShuffleIcon, Music} from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import usePublicAlbumStore from '../../Stores/PublicAlbumStore';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import useScreenSize from '../../Auth/ScreenSizeProvider';
  

const UserLibary = () => {
    const {width} = useScreenSize()
    const {formatTime} = useFormatTimeStore()
    const {getLibrary, library} = useLibraryStore()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const isPlaying = useMusicPlayerStore(state => state.isPlaying)
    const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
    const setSongList = useMusicPlayerStore(state => state.setSongList)
    const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)

    useEffect(()=>{
        getLibrary()
    }, [])

    const playAll = () => {
        setSongList(library.tracks)
        setCurrentSong(library.tracks[0])
    }

    const playAllShuffled = () => {
        const index = Math.floor(Math.random() * library.tracks.length);
        setSongList(library.tracks)
        setCurrentSong(library.tracks[index])
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
        setSongList(library.tracks)
        setCurrentSong(track)
        setIsPlaying(true)
        setIsLoading(true)
    }
    
  return (
    <div className=" text-white h-full w-full overflow-hidden flex">
        {/* Main Content */}
      <div className="flex-1 h-full overflow-auto">

        {/* Playlist Header */}
        <div className="bg-gradient-to-b from-green-600 to-green-800 p-3 sm:p-8">
        <div className="flex flex-row items-center sm:flex-row sm:items-end gap-6">
            <div  className="w-16 h-16 sm:w-44 sm:h-44 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center bg-cover justify-center"> 
                <Music size={width >= 640 ? 110 : 25} className="text-white" />
            </div>
            
            <div className="flex-1  w-full">
            <p className="text-sm font-medium mb-2">PRIVATE LIBRARY</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-x-2 text-sm text-gray-300">
                <span className='hidden sm:block'>•</span>
                <span>{library?.total_songs} songs</span>
                <span className='hidden sm:block'>•</span>
                <span>about {library?.total_duration}</span>
            </div>
            </div>
        </div>
        </div>

        {/* album Controls */}
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
        <div className="px-4 sm:px-6 pb-32">
  {/* Table Header – Hidden on mobile */}
  <div className="hidden sm:grid grid-cols-11 md:grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-400 uppercase tracking-wide border-b border-gray-800 mb-4">
    <div className="col-span-1">#</div>
    <div className="col-span-8">Title</div>
    <div className="hidden md:block col-span-2">Date added</div>
    <div className="col-span-1 flex justify-center">
      <Clock size={16} />
    </div>
    <div className="col-span-1 flex justify-center">
    </div>
  </div>

  {/* Track Rows */}
  <div className="space-y-1">
    {library?.library_songs?.map((track, index) => {
      const now = new Date();
      const createdAt = new Date(track?.created_at);
      const diffMs = now - createdAt;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const dateAdded =
        diffDays > 0
          ? `${diffDays} days ago`
          : diffHours > 0
          ? `${diffHours} hours ago`
          : diffMins > 0
          ? `${diffMins} minutes ago`
          : "a few seconds ago";

      return (
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
                {track.artists.join(", ")}
              </p>
            </div>
          </div>

          {/* Date added – hidden on mobile */}
          <div className="hidden md:flex col-span-2 items-center">
            <p className="text-sm text-gray-400">{dateAdded}</p>
          </div>

          {/* Duration & More – only More shown on mobile */}
          <div className="col-span-1 flex items-center justify-center md:justify-center space-x-2">
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
      );
    })}
  </div>
</div>


      </div>
      
    </div>
  )
}

export default UserLibary