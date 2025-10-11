import React from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight, ListMusic, Disc, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSidebarStore from '../Stores/sidebarStore';
import useScreenSize from '../Auth/ScreenSizeProvider';

const MobileSidebar = ({closeSidebar}) => {
  const navigate = useNavigate()
  const {width} = useScreenSize()
  const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen)
  const setIsSidebarOpen = useSidebarStore(state => state.setIsSidebarOpen)
  const homePaths = ['/', '/public/playlist', '/public/album', '/', '/home']

  return (
    <main className={`h-full w-full transition-all duration-300 ease-in-out z-90 overflow-hidden`}>
    <div className='h-full w-full bg-[linear-gradient(180deg,_#0f0f0f_0%,_#1a1a1a_190%)] relative z-[999] border-r border-[#333]'>
        <div className="flex flex-col w-full h-full shadow-2xl backdrop-blur-lg border-white/10 z-90">
        {/* Logo */}
        <div className={` p-6`}>
            <div className='flex justify-between w-full'>
            <button onClick={()=>navigate('/')} className="text-2xl font-bold text-transparent cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            MusicGo
            </button>
            <button onClick={()=>closeSidebar()} className='' >
            <Menu size={30} className="text-gray-400 hover:text-white " />
            </button>
            </div>
        </div>

        {/* Navigation */}
        <nav className={` px-6 space-y-2`}>
          <button onClick={()=>{navigate('/');closeSidebar()}} className={` ${homePaths.includes(window.location.pathname) && 'bg-white/10'} w-full cursor-pointer flex items-center space-x-5 p-3 rounded-lg  text-gray-400 hover:bg-white/10 transition-colors`}>
            <Home size={20} />
                <span>Home</span>
          </button>
          <button onClick={()=>{navigate('/search');closeSidebar()}} className={`${window.location.pathname === '/search' && 'bg-white/10'} w-full flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors`}>
            <Search size={20} />
               <span>Search</span>
          </button>
          {/* <button onClick={()=>{navigate('/user/library');closeSidebar()}} className={`${window.location.pathname === '/user/library' && 'bg-white/10'} w-full cursor-pointer flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors`}>
            <Library size={20} />
             <span>Your Library</span>
          </button>
          <button onClick={()=> {navigate('/user/playlist');closeSidebar()}} className={`${(window.location.pathname === '/user/playlist' || window.location.pathname === '/user/playlist/detail' ) && 'bg-white/10'} w-full cursor-pointer flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors`}>
            <Disc size={20} />
              <span className=' whitespace-nowrap'>Your Playlists</span>
          </button> */}
        </nav>

        {/* Playlists */}
        {
          
          <div className="px-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-300">Recently Played</h3>
            <button className="text-gray-400 hover:text-white">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            {['My Playlist #1'].map((playlist, index) => (
              <a key={index} href="#" className="flex items-center p-2 space-x-3 text-gray-400 transition-colors rounded-lg hover:text-white hover:bg-white/5">
                <div className="flex items-center justify-center w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-pink-500">
                  {index === 0 ? <Heart size={16} color='white' /> : <Music size={16} color='white' />}
                </div>
                <div>
                  <div className="text-sm font-medium">{playlist}</div>
                  <div className="text-xs text-gray-400">Playlist</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        }
        </div>
    </div>
    </main>
  )
}

export default MobileSidebar