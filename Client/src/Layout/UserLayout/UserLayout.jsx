import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider'
import Navbar from '../../Pages/Navbar/Navbar'
import MusicPlayer from '../../Pages/MusicPlayer'
import Sidebar from '../../Components/Sidebar'
import useScreenSize from '../../Auth/ScreenSizeProvider'

const UserLayout = () => {
  const {isAuthenticated, user} = useAuth()
  const {width} = useScreenSize()

  useEffect(()=>{
    if(isAuthenticated === false){
      window.location.href = '/signin'
    }
  }, [isAuthenticated])

  return (
    <main className='h-screen overflow-hidden flex flex-col'>
        {
          isAuthenticated === true &&
          <section className='flex-1 min-h-0 flex'>
          {
          width >= 900 && (
            <section className=' flex-none z-[9999999] hidden lg:block'>
              <Sidebar />
            </section>
          )}
          <section className='h-screen overflow-auto w-full flex-1 flex flex-col relative'>
              {/* Navbar */}
              <Navbar />

              {/* Children */}
              <Outlet />
            </section>
          </section>
        }
    </main>
  )
}

export default UserLayout