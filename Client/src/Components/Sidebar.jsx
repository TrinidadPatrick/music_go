import React from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight, ListMusic, Disc, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSidebarStore from '../Stores/sidebarStore';
import useScreenSize from '../Auth/ScreenSizeProvider';

const Sidebar = () => {
  const navigate = useNavigate()
  const {width} = useScreenSize()
  const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen)
  const setIsSidebarOpen = useSidebarStore(state => state.setIsSidebarOpen)
  const homePaths = ['/', '/public/playlist', '/public/album', '/', '/home']

  const sidebarOpen = isSidebarOpen && width >= 1024

  return (
    <main className={`h-full ${!sidebarOpen ? 'w-[70px]' : 'w-[320px]'} transition-all duration-300 ease-in-out bg-red-100 overflow-hidden`}>
    <div className='h-full w-[320px] max-w-[320px] bg-[linear-gradient(180deg,_#0f0f0f_0%,_#1a1a1a_190%)] relative z-[999] border-r border-[#333]'>
        <div className="w-full h-full backdrop-blur-lg shadow-2xl border-white/10 flex flex-col">
        {/* Logo */}
        <div className={`${sidebarOpen ? 'p-6' : 'p-5'} `}>
          {
            sidebarOpen ?
            <div className='w-full flex justify-between'>
            <button onClick={()=>navigate('/')} className="text-2xl cursor-pointer font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            MusicHub
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
          <button className={`${sidebarOpen ? 'w-full' : 'w-fit'} flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors`}>
            <Search size={20} />
            {
              sidebarOpen && <span>Search</span>
            }
          </button>
          <button onClick={()=>navigate('/user/library')} className={`${window.location.pathname === '/user/library' && 'bg-white/10'} ${sidebarOpen ? 'w-full' : 'w-fit'} cursor-pointer flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors`}>
            <Library size={20} />
            {
              sidebarOpen && <span>Your Library</span>
            }
          </button>
          <button onClick={()=> navigate('/user/playlist')} className={`${(window.location.pathname === '/user/playlist' || window.location.pathname === '/user/playlist/view' ) && 'bg-white/10'} ${sidebarOpen ? 'w-full' : 'w-fit'} cursor-pointer flex items-center space-x-5 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors`}>
            <Disc size={20} />
            {
              sidebarOpen && <span className=' whitespace-nowrap'>Your Playlists</span>
            }
          </button>
        </nav>

        {/* Playlists */}
        {
          sidebarOpen &&
          <div className="px-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-300 font-medium">Recently Played</h3>
            <button className="text-gray-400 hover:text-white">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="space-y-2">
            {['My Playlist #1'].map((playlist, index) => (
              <a key={index} href="#" className="flex items-center space-x-3 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center">
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

export default Sidebar