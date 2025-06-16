import React, { useEffect, useState } from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider'
import Navbar from '../../Pages/Navbar/Navbar'
import useScreenSize from '../../Auth/ScreenSizeProvider'
import Sidebar from '../../Components/Sidebar'
import MusicPlayer from '../../Pages/MusicPlayer'
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore'

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
    <main className='h-[100svh] overflow-hidden flex flex-col bg-gradient-to-br from-gray-950 via-slate-950 to-black'>
      <div className='h-[100svh] '>
      {
        !isLoading && (
          <section className='flex'>

            {
              showSidebar && width >= 900 &&
              <section className='w-[250px] xl:w-full max-w-xs h-screen z-[9999999] flex-none hidden lg:block'>
                <Sidebar />
              </section>
            }

            <section className='h-[100svh] overflow-auto w-full flex-1 flex flex-col relative'>
              {/* Navbar */}
              {showNavbar && <Navbar />}

              {/* Children */}
              <Outlet />
              {/* Music Player */}
              <div className=' w-full h-fit relative z-40 bottom-0 mt-1'>
                <MusicPlayer />
              </div>
            </section>
              
          </section>
        )
      }
      </div>
      
    </main>
  )
}

export default GuestLayout