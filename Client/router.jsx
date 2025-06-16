import {createBrowserRouter} from 'react-router-dom'
import MusicPlayer from './src/Pages/MusicPlayer'
import UserLayout from './src/Layout/UserLayout/UserLayout'
import MainSection from './src/Pages/MainSection'
import GuestLayout from './src/Layout/GuestLayout/GuestLayout'
import Signin from './src/Pages/Signin'
import Signup from './src/Pages/Signup'
import Playlist from './src/Pages/Playlist/Playlist'
import Album from './src/Pages/Album/Album'
import UserLibary from './src/Pages/Library/UserLibrary'

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/',
                element: <MainSection />
            },
            {
                path: 'public/playlist',
                element: <Playlist />
            },
            {
                path: 'public/album',
                element: <Album />
            },
            {
                path: '/signin',
                element: <Signin />
            },
            {
                path: '/signup',
                element: <Signup />
            }
        ]
    },
    {
        path: '/user',
        element: <UserLayout />,
        children: [
            {
                path: '/user/account',
                element: <div></div>
            },
            {
                path: '/user/library',
                element: <UserLibary />
            }
        ]
    }
])

export default router