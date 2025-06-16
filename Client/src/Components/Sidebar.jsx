import React from 'react'
import { Play, Pause, Heart, MoreHorizontal, Music, Search, Home, Library, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate()

  const homePaths = ['/', '/public/playlist', '/public/album', '/', '/home']

  return (
    <div className='h-full w-full bg-black/30 relative z-[999]'>
        <div className="w-full h-full backdrop-blur-lg border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            MusicHub
          </h1>
        </div>

        {/* Navigation */}
        <nav className="px-6 space-y-2">
          <button onClick={()=>navigate('/')} className={` ${homePaths.includes(window.location.pathname) && 'bg-white/10'} w-full cursor-pointer flex items-center space-x-3 p-3 rounded-lg  text-gray-400 hover:bg-white/10 transition-colors`}>
            <Home size={20} />
            <span>Home</span>
          </button>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <Search size={20} />
            <span>Search</span>
          </a>
          <button onClick={()=>navigate('/user/library')} className={`${window.location.pathname === '/user/library' && 'bg-white/10'} flex w-full cursor-pointer items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors`}>
            <Library size={20} />
            <span>Your Library</span>
          </button>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <Heart size={20} />
            <span className=' whitespace-nowrap'>Your Liked Songs</span>
          </a>
        </nav>

        {/* Playlists */}
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
                  {index === 0 ? <Heart size={16} /> : <Music size={16} />}
                </div>
                <div>
                  <div className="text-sm font-medium">{playlist}</div>
                  <div className="text-xs text-gray-400">Playlist</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        </div>
    </div>
  )
}

export default Sidebar