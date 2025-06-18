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
    // Fix: Use h-full and proper flex structure
    <main className='h-full flex flex-col bg-gradient-to-br from-gray-950 via-slate-950 to-black'>
      <section className='flex-1 min-h-0 flex m-1'>
          {showSidebar && width >= 900 && (
            <section className='w-[250px] xl:w-full max-w-xs flex-none  z-[9999999] hidden lg:block'>
              <Sidebar />
            </section>
          )}
        <section className='flex-1 min-h-0 flex flex-col'>
          {/* Navbar */}
          {showNavbar && <Navbar />}

          {/* Children - Fix: Ensure proper height flow */}
          <div className='flex-1 min-h-0 flex over'>
            <Outlet />
          </div>
        </section>
      </section>
    </main>
  )
}

export default GuestLayout

// {!isLoading && (
//   <section className='flex flex-1'>

//     {showSidebar && width >= 900 && (
//       <section className='w-[250px] xl:w-full max-w-xs flex-1  z-[9999999] hidden lg:block'>
//         <Sidebar />
//       </section>
//     )}

//     <section className='flex-1 flex flex-col overflow-y-auto'>
//       {/* Navbar */}
//       {showNavbar && <Navbar />}

//       {/* Children */}
//       <Outlet />
//     </section>

//   </section>
// )}