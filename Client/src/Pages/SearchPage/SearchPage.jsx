import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import http from '../../../http'
import Tabs from './Tabs'
import SongsTab from './SongsTab'
import useSearchPageStore from '../../Stores/SearchPageStore'
import MainSongs from './MainSongs'
import SearchPageLoader from './SearchPageLoader'
import MainVideos from './MainVideos'
import VideosTab from './VideosTab'
import { SearchIcon } from 'lucide-react'

const SearchPage = () => {
    // Stores
    const setResults = useSearchPageStore( state => state.setResults)
    const results = useSearchPageStore( state => state.results)
    const activeTab = useSearchPageStore( state => state.activeTab)
    const isSearching = useSearchPageStore( state => state.isSearching)
    const setIsSearching = useSearchPageStore( state => state.setIsSearching)

    // Params
    const [params, setParams] = useSearchParams()
    const q = params.get('q') || ''

    const handleSearch = async (searchValue) => {
        const filters = ["videos", "songs", "albums", "featured_playlists", "playlists", "artists", "playlists"]
        if(searchValue !== ''){
          setIsSearching(true)
          for (const filter of filters){
            try {
                const response = await http.get(`/music/search?q=${searchValue}&filter=${filter}&limit=20`)
                setResults({ [filter]: {partial : response.data} })
                setResults({ [filter]: {all : response.data} })
                setIsSearching(false)
              } catch (error) {
                console.log(error)
              }
          }
        }else{
            setResults({
                videos: [],
                songs: [],
                albums: [],
                artists: [],
                playlists: [],
                featured_playlists: []
            })
        }
    };

    useEffect(()=>{
        handleSearch(q)
    }, [q])

  return (
    <main className='flex-1 flex flex-col p-5'>
      {
        q === '' ?
        <section className='flex-1  flex justify-center items-center'>
          <div className='flex flex-col gap-2 items-center'>
          <h1 className='text-4xl font-bold text-white text-center'>Whats on your mind?</h1>
          <p className='text-gray-400 text-sm text-center'>Enter a song, artist, album, or playlist to get started</p>
          </div>
        </section>
        :
        <>
        <Tabs />
        {
          isSearching ? <SearchPageLoader />
          :
          <section className='flex-1 overflow-auto w-full flex flex-col gap-3'>
                {
                  activeTab === 'songs' ?
                  <SongsTab />
                  :
                  activeTab === 'videos' ?
                  <VideosTab />
                  :
                  activeTab === 'all' ?
                  <>
                  <MainVideos />
                  <MainSongs />
                  </>
                  :
                  ""
                }
        </section>
        }
        </>
      }
    </main>
  )
}

export default SearchPage