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
    <main className='h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-950 via-slate-950 to-black'>
        {
          isAuthenticated === true &&
          <section className='flex'>
          {
            width >= 900 &&
            <section className='w-[250px] xl:w-full max-w-xs h-screen z-[9999999] flex-none hidden lg:block'>
              <Sidebar />
            </section>
          }
          <section className='h-screen overflow-auto w-full flex-1 flex flex-col relative '>
              {/* Navbar */}
              <Navbar />

              {/* Children */}
              <Outlet />
              {/* Music Player */}
              {/* <div className=' w-full h-fit relative z-40 bottom-0 mt-1'>
                <MusicPlayer />
              </div> */}
            </section>
          </section>
        }
    </main>
  )
}

export default UserLayout