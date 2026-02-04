import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import router from '../router.jsx'
import { AuthProvider } from './Providers/AuthProvider.jsx'
import MusicPlayer from './Components/MusicPlayer/index.jsx'
import { Toaster } from 'react-hot-toast'
import Modal from 'react-modal'

Modal.setAppElement('#root');
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <div className='h-[100svh] flex flex-col overflow-hidden bg-background'>
        <div className='flex flex-col flex-1 min-h-0'>
          <RouterProvider router={router} />
          <Toaster position='bottom-right' />
        </div>
        <div className='z-[9999] flex-shrink-0 w-full bg-blue-100'>
          <MusicPlayer />
          <Toaster position='bottom-right' />
        </div>
      </div>
    </AuthProvider>
  </StrictMode>,
)