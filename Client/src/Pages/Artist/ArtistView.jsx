import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import http from '../../../http'
import { Play, ShuffleIcon } from 'lucide-react'
import ArtistTabs from './ArtistTabs'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'
import ArtistMainVideos from './ArtistMainVideos'
import useScreenSize from '../../Auth/ScreenSizeProvider'
import ArtistVideosTab from './ArtistVideosTab'
import ArtistMainSongs from './ArtistMainSongs'
import ArtistSongsTab from './ArtistSongsTab'
import ArtistMainAlbums from './ArtistMainAlbums'
import ArtistAlbumsTab from './ArtistAlbumsTab'

const ArtistView = () => {
    const {width} = useScreenSize()
    const [params] = useSearchParams()
    const artistId = params.get('id')
    const [artist, setArtist] = useState(null)
    const [loading, setLoading] = useState(false)

    const setArtistData = useArtistDetailStore( state => state.setArtistData)
    const activeTab = useArtistDetailStore( state => state.activeTab)

    const Loader = () => {
      return (
        <div className="w-full min-h-screen text-white ">
          {/* Header Section */}
          <div className="flex items-center p-8 space-x-6">
            {/* Profile Image Skeleton */}
            <div className="w-32 h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            
            {/* Artist Info Skeleton */}
            <div className="flex-1">
              <div className="h-12 mb-4 bg-gray-700 rounded-lg w-80 animate-pulse"></div>
              <div className="w-full h-4 max-w-2xl mb-2 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 mb-4 bg-gray-700 rounded w-96 animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-40 h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs Skeleton */}
          <div className="px-8 mb-8">
            <div className="flex space-x-8 border-b border-gray-700">
              {['Featured', 'Videos', 'Songs', 'Albums'].map((tab, index) => (
                <div key={index} className="pb-4">
                  <div className="w-16 h-5 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div className="px-8 mb-12">
            <div className="w-24 h-8 mb-6 bg-gray-700 rounded animate-pulse"></div>
            
            {/* Video Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="space-y-3">
                  {/* Video Thumbnail */}
                  <div className="relative bg-gray-700 rounded-lg aspect-video animate-pulse">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800"></div>
                  </div>
                  
                  {/* Video Title */}
                  <div className="w-3/4 h-5 bg-gray-700 rounded animate-pulse"></div>
                  
                  {/* Video Stats */}
                  <div className="w-1/2 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Songs Section */}
          <div className="px-8">
            <div className="w-20 h-8 mb-6 bg-gray-700 rounded animate-pulse"></div>
            
            {/* Songs List */}
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center p-2 space-x-4">
                  {/* Track Number */}
                  <div className="w-8 h-6 bg-gray-700 rounded animate-pulse"></div>
                  
                  {/* Album Art */}
                  <div className="w-12 h-12 bg-gray-700 rounded animate-pulse"></div>
                  
                  {/* Song Info */}
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-5 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  
                  {/* Song Title (Right Side) */}
                  <div className="w-24 h-5 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    const tabs = [
        { id: 'featured', label: 'Featured' },
        { id: 'videos', label: 'Videos' },
        { id: 'songs', label: 'Songs' },
        { id: 'albums', label: 'Albums' },
    ];


    const getArtist = async () => {
      setLoading(true)
        if(artistId){
            try {
                const result = await http.get(`music/artist?artistId=${artistId}`)
                if(result.data){
                    setArtist(result.data)
                    tabs.forEach((tab) => {
                        if(tab.id !== 'featured'){
                            setArtistData({[tab.id] : {
                                browseId: result.data[tab.id]?.browseId || null,
                                params: result.data[tab.id]?.params || null,
                                all : result.data[tab.id]?.results,
                                partial : result.data[tab.id]?.results,
                                hasData : true
                            }})
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
        setLoading(false)
    }

    useEffect(()=>{
        getArtist()
    }, [artistId])

    
  return loading ? <Loader /> : (
    <main style={{width: width <= 1023 ? '100vw' : '93.5vw'}} className='flex flex-col flex-1 gap-5 p-5'>
        {/* Header */}
        <div className="flex w-full p-3 rounded">
            <div className="flex flex-row items-center w-full gap-6 sm:items-end">
              {
                artist?.thumbnails ?
                <div className="items-center justify-center hidden overflow-hidden bg-cover rounded shadow-2xl aspect-square max-w-44 max-h-44 sm:flex">
                  <img referrerPolicy='no-referrer' src={artist?.thumbnails[0].url} alt={artist?.name} className="object-cover w-full h-full" />
                </div>
                :
                <div className="items-center justify-center hidden h-full bg-cover rounded-lg shadow-2xl aspect-square sm:w-44 sm:h-44 sm:flex">
                  <div className="w-6 h-6 bg-gray-600 rounded"></div>
                </div>
              }
              
              <div className="flex flex-col justify-center w-full h-full gap-4 sm:justify-end">
                {/* Title */}
                <p className="text-4xl sm:text-[2.5rem] md:text-[2.9rem] font-medium line-clamp-1 text-white">
                  {artist?.name}
                </p>
                <p className="text-sm font-medium text-gray-300 line-clamp-2">
                  {artist?.description}
                </p>
                {/* Additional Info */}
                <div className="flex flex-row items-start space-x-2 text-sm text-gray-300 sm:items-center">
                  <span>{artist?.subscribers} subscribers</span>
                  <span className='hidden sm:block'>•</span>
                  <span>{artist?.views}</span>
                </div>
              </div>
            </div>
        </div>
        {/* Tabs */}
        <ArtistTabs />
        <section className='flex flex-col w-full gap-3 overflow-auto '>
            {
                activeTab === 'featured' ?
                <>
                <ArtistMainVideos />
                <ArtistMainSongs />
                <ArtistMainAlbums />
                </>
                :
                activeTab === 'videos' ?
                <ArtistVideosTab />
                :
                activeTab === 'songs' ?
                <ArtistSongsTab />
                :
                activeTab === 'albums' ?
                <ArtistAlbumsTab />
                :
                ''
            }
        </section>
    </main>
  )
}

export default ArtistView