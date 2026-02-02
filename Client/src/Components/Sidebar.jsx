import React, { useEffect, useState } from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight, ListMusic, Disc, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSidebarStore from '../Stores/sidebarStore';
import useScreenSize from '../Auth/ScreenSizeProvider';
import localforage from 'localforage';
import useMusicPlayerStore from '@/Stores/MusicPlayerStore.js';
import useGetSongRecommendation from '@/Stores/NextSongRecommendationStore.js';
import _ from 'lodash';

const Sidebar = () => {
  const navigate = useNavigate()
  const {width} = useScreenSize()
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const currentSong = useMusicPlayerStore(state => state.currentSong)
  const recently_played = useMusicPlayerStore(state => state.recently_played)
  const setRecentlyPlayed = useMusicPlayerStore(state => state.setRecentlyPlayed)
  const getSongRecommendation = useGetSongRecommendation(state => state.getSongRecommendation)
  const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen)
  const setIsSidebarOpen = useSidebarStore(state => state.setIsSidebarOpen)
  const homePaths = ['/', '/public/playlist', '/public/album', '/', '/home']
  // const [recently_played, setRecentlyPlayed] = useState(null)

  const sidebarOpen = isSidebarOpen && width >= 1024

  const getRecentlyPlayed = async () => {
    const recently_played = await localforage.getItem('recently_played') || []
    setRecentlyPlayed(recently_played)
  }

  const handleSelect = async (track) => {
    if (track?.playlistId) {
      navigate(`/public/playlist?list=${track.playlistId}`)
    } else if (track?.type === 'Album' && track?.browseId) {
      navigate(`/public/album?list=${track.browseId}`)
    } else if (track?.videoId) {
      if (currentSong?.videoId !== track.videoId) {
        setCurrentSong(track)
        try {
          const songList = await getSongRecommendation(track.videoId)
          if (songList?.tracks) {
            setSongList(songList.tracks)
          }
        } catch (error) {
          console.error('Failed to get song recommendations:', error)
        }
      }
    }
  }

  useEffect(()=>{
    getRecentlyPlayed()
  },[])


  return (
    <main id='sidebar' className={`h-full flex ${!sidebarOpen ? 'w-[70px]' : 'w-[320px]'} transition-all duration-300 ease-in-out  overflow-hidden`}>
    <div className={`h-screen ${currentSong ? 'pb-25' : 'pb-2'} w-[320px] max-w-[320px] bg-card relative z-[999] border-r border-[#333]`}>
        <div className="flex flex-col w-full h-full border-white/10  overflow-auto">
        {/* Logo */}
        <div className={`${sidebarOpen ? 'p-6' : 'p-5'} `}>
          {
            sidebarOpen ?
            <div className='flex justify-between w-full'>
            <button onClick={()=>navigate('/')} className="text-2xl font-bold text-transparent cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            MusicGo
            </button>
            <button onClick={()=>setIsSidebarOpen(false)} className='cursor-pointer' >
            <Menu size={30} className="text-gray-400 hover:text-white " />
            </button>
            </div>
            :
            <button onClick={()=>setIsSidebarOpen(true)} className='cursor-pointer' >
              <Menu size={30} className="text-gray-400 hover:text-white " />
            </button>
          }
        </div>

        {/* Navigation */}
        <nav className={`${sidebarOpen ? 'px-6' : 'px-3'} space-y-2`}>
          <button onClick={()=>navigate('/')} className={` ${homePaths.includes(window.location.pathname) && 'bg-white/10'} ${sidebarOpen ? 'w-full' : 'w-fit'} cursor-pointer flex items-center space-x-5 p-3 rounded-lg  text-gray-400 hover:bg-white/10 transition-colors`}>
            <Home size={20} />
            {
              sidebarOpen && <span>Home</span>
            }
          </button>
          <button onClick={()=>navigate('/search')} className={`${window.location.pathname === '/search' && 'bg-white/10'} ${sidebarOpen ? 'w-full' : 'w-fit'} cursor-pointer flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors`}>
            <Search size={20} />
            {
              sidebarOpen && <span>Search</span>
            }
          </button>
        </nav>

        {/* Playlists */}
        {
          sidebarOpen &&
          <div className={`px-6 mt-8 flex-1 flex flex-col min-h-0 ${currentSong ? '' : ''} `}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-300">Recently Played</h3>
          </div>
          
          <div className="space-y-2 flex-1 min-h-0 flex flex-col overflow-auto">
            {recently_played && recently_played.map((song, index) => (
              <button onClick={() => handleSelect(song)} key={index} className={`${_.isEqual(currentSong, song) && 'bg-white/5'} w-full flex items-center p-2 space-x-3 text-gray-400 transition-colors rounded-lg hover:text-white hover:bg-white/5`}>
                <div className="flex items-center justify-center w-10 h-10 flex-none rounded bg-gradient-to-br from-purple-500 to-pink-500">
                  {index === 0 ? <Heart size={16} color='white' /> : <Music size={16} color='white' />}
                </div>
                <div className='flex flex-col items-start'>
                  <div className="text-sm font-medium line-clamp-1">{song.title}</div>
                  <div className="text-xs text-gray-400">{song.artists[0]?.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        }
        </div>
    </div>
    </main>
  )
}

export default Sidebar