import React, { useEffect, useMemo, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler';
import { Hamburger, Menu, Search, SidebarOpenIcon, SquareMenu, X } from 'lucide-react'
import http from '../../../http'
import { useAuth } from '../../Auth/AuthProvider';
import Sidebar from '../../Components/Sidebar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useScreenSize from '../../Auth/ScreenSizeProvider';
import MobileSidebar from '../../Components/MobileSidebar';
import useSidebarStore from '../../Stores/sidebarStore';
import useSearchPageStore from '../../Stores/SearchPageStore';

const Navbar = () => {
  const [params, setParams] = useSearchParams()
  const { width } = useScreenSize()
  const navigate = useNavigate()
  const debounceRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '')
  const [suggestions, setSuggestions] = useState([])
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false);
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const setActiveTab = useSearchPageStore((state) => state.setActiveTab)
  const [arrowedSuggestion, setArrowedSuggestion] = useState(null)

  const handleSelectSuggestion = (suggestion) => {
    setIsTyping(false)
    setSearchQuery(suggestion);
    setActiveTab('all')
    navigate(`/search?q=${suggestion}`)
  }

  const closeSidebar = () => {
    setIsAnimating(true);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    // Automatically unmount after animation ends (300ms)
    if (!isMobileSidebarOpen && isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobileSidebarOpen, isAnimating]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery !== '' && arrowedSuggestion === null) {

      debounceRef.current = setTimeout(async () => {
        if (searchQuery !== '') {
          try {
            const response = await http.get(`music/autoComplete?q=${searchQuery}`);
            const data = response.data.slice(0, 10);
            setSuggestions(data);
          } catch (error) {
            console.log(error);
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
        }
      }, 150);
    } else if (searchQuery == '' && arrowedSuggestion === null) {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const handleArrowSelection = (key) => {
    if (!suggestions) return
    switch (key) {
      case 'ArrowDown':
        if (arrowedSuggestion === null || arrowedSuggestion >= suggestions.length - 1) {
          setArrowedSuggestion(0)
          setSearchQuery(suggestions[0])
        }
        else {
          setArrowedSuggestion(arrowedSuggestion + 1)
          setSearchQuery(suggestions[arrowedSuggestion + 1])
        }
        break;
      case 'ArrowUp':
        setArrowedSuggestion(suggestions.length - 1)
        setSearchQuery(suggestions[suggestions.length - 1])
        break
    }
  }

  return (
    <div className="bg-transparent z-90 p-4 flex items-center justify-between gray-700 w-full">
      <div className='flex items-center gap-2'>
        {/* Hamburger */}
        <button className='lg:hidden' onClick={() => { setIsAnimating(true); setTimeout(() => setIsMobileSidebarOpen(true), 10) }}>
          <Menu size={30} className="text-gray-400 hover:text-white " />
        </button>

        {
          !isSidebarOpen &&
          <button onClick={() => navigate('/')} className="text-2xl hidden md:block cursor-pointer font-bold text-primary">
            MusicGo
          </button>
        }
      </div>

      {/* Sidebar mobile */}
      {isAnimating && width < 1024 && (
        <div
          className={`
            sm:max-w-xs h-screen absolute bg-[#06080e] z-90 w-full top-0 left-0
            transform transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <MobileSidebar closeSidebar={closeSidebar} />
        </div>
      )}

      {/* Search field and account button */}
      <div className='flex w-full sm:w-[400px]'>
        {/* Search Bar */}
        <div className="flex-1 mx-4 ">
          <div className="relative  w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <OutsideClickHandler onOutsideClick={() => setIsTyping(false)}>
              <input
                onFocus={() => setIsTyping(true)}
                type="text"
                onKeyDown={
                  (e) => {

                    if (e.key === 'Enter') {
                      setActiveTab('all')
                      setIsTyping(false)
                      navigate(`/search?q=${searchQuery}`)
                    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                      handleArrowSelection(e.key)
                    } else {
                      setArrowedSuggestion(null)
                      setIsTyping(true)
                    }
                  }
                }
                placeholder="Search for songs, artists..."
                className=" placeholder:text-gray-400 text-white w-full bg-card border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Suggestions List */}
              <div className='w-full bg-card absolute translate-y-2 rounded'>
                {
                  suggestions.length > 0 && isTyping && suggestions.map((suggestion, index) => (
                    <button onClick={() => { handleSelectSuggestion(suggestion) }} key={index}
                      className={`${arrowedSuggestion === index && 'bg-secondary/70'} flex items-center justify-start gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-secondary/20 w-full`}>
                      <div>
                        <Search className='text-gray-400 w-4 h-4' />
                      </div>
                      <p className="text-gray-300">{suggestion}</p>
                    </button>
                  ))
                }
              </div>
            </OutsideClickHandler>
          </div>
        </div>

        {/* {
          isAuthenticated === true ?
            <div className="flex items-center space-x-2">
              {user && <img referrerPolicy='no-referrer' src={user?.user?.profile_image || `https://avatar.iran.liara.run/public/boy?username=${user.name}`} className="w-8 bg-cover h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg"></img>}
            </div>
            :
            isAuthenticated === false &&
            (
              <div className='flex gap-3 items-center'>
                <button onClick={() => { window.location.href = '/signin' }} className='text-gray-400 cursor-pointer hover:text-gray-500'>Sign In</button>
              </div>
            )
        } */}
      </div>
    </div>

  )
}

export default Navbar