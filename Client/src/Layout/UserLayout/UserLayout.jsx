import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../Auth/AuthProvider'
import Navbar from '../../Pages/Navbar/Navbar'

const UserLayout = () => {
  const {isAuthenticated, user} = useAuth()

  useEffect(()=>{
    if(isAuthenticated === false){
      window.location.href = '/signin'
    }
  }, [isAuthenticated])

  return (
    <main className='h-screen overflow-hidden flex flex-col bg-gradient-to-br from-gray-950 via-slate-950 to-black'>
        {
          isAuthenticated === true &&
          <>
          <Navbar user={user} />
          <Outlet />
          </>
        }
    </main>
  )
}

export default UserLayout