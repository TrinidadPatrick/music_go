import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from '../router.jsx'
import { AuthProvider } from './Auth/AuthProvider.jsx'
import MusicPlayer from './Pages/MusicPlayer/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='h-[100svh] flex flex-col overflow-hidden'>
        <div className='flex-1 min-h-0 flex flex-col'>
          <RouterProvider router={router} />
        </div>
        <div className='z-40 w-full  bg-blue-100 flex-shrink-0'>
          <MusicPlayer />
        </div>
      </div>
    </AuthProvider>
  </StrictMode>,
)