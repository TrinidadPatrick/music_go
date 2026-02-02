import React, { useEffect, useState } from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider'
import Navbar from '../../Pages/Navbar/Navbar'
import useScreenSize from '../../Auth/ScreenSizeProvider'
import Sidebar from '../../Components/Sidebar'
import MusicPlayer from '../../Pages/MusicPlayer'
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore'
import localforage from 'localforage'

const GuestLayout = () => {
  const navigate = useNavigate()
  const {isAuthenticated} = useAuth()
  const {width} = useScreenSize()
  const getLibrary = useLibraryStore(state => state.getLibrary)
  const path = window.location.pathname
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const authPages = ['/signin', '/signup'];
    const isAuthPage = authPages.includes(path);
    
    if (isAuthPage && isAuthenticated) {
      navigate('/home', { replace: true });
      return;
    }

    return setIsLoading(false);
  }, [isAuthenticated, path, navigate]);

  useEffect(() => {
    getLibrary()
  }, [])

  if (isLoading) {
    return null;
  }

  const showNavbar = path !== '/signin' && path !== '/signup' && path !== '/user/account';
  const showSidebar = path !== '/signin' && path !== '/signup';

  return (
    <main className='flex flex-col h-full'>
      <section className='flex flex-1 min-h-0'>
          {showSidebar && width >= 900 && (
            <section className='relative flex-none hidden z-90 lg:block'>
              <Sidebar />
            </section>
          )}
        <section className='z-0 flex flex-col flex-1 min-h-0'>
          {/* Navbar */}
          {showNavbar && <Navbar />}

          {/* Children - Fix: Ensure proper height flow */}
          <div className='relative flex flex-1 min-h-0 p-1 overflow-hidden'>
            <Outlet />
          </div>
        </section>
      </section>
    </main>
  )
}

export default GuestLayout