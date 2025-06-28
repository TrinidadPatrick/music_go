import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from '../router.jsx'
import { AuthProvider } from './Auth/AuthProvider.jsx'
import MusicPlayer from './Pages/MusicPlayer/index.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='h-[100svh] flex flex-col overflow-hidden bg-[linear-gradient(135deg,_rgba(0,0,0,0.9)_0%,_rgba(26,26,46,0.9)_100%)]'>
        <div className='flex flex-col flex-1 min-h-0'>
          <RouterProvider router={router} />
          <Toaster position='bottom-right' />
        </div>
        <div className='z-40 flex-shrink-0 w-full bg-blue-100'>
          <MusicPlayer />
        </div>
      </div>
    </AuthProvider>
  </StrictMode>,
)