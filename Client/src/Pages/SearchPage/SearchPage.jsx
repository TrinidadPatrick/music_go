import React, { useEffect, useRef, useState } from 'react'
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
import MainArtists from './MainArtists'
import ArtistsTab from './ArtistsTab'
import MainAlbums from './MainAlbums'
import AlbumsTab from './AlbumsTab'
import MainPlaylists from './MainPlaylists'
import PlaylistsTab from './PlaylistsTab'
import useScreenSize from '../../Auth/ScreenSizeProvider'

const SearchPage = () => {
    // Stores
    const {width} = useScreenSize()
    const setResults = useSearchPageStore( state => state.setResults)
    const results = useSearchPageStore( state => state.results)
    const activeTab = useSearchPageStore( state => state.activeTab)
    const isSearching = useSearchPageStore( state => state.isSearching)
    const setIsSearching = useSearchPageStore( state => state.setIsSearching)

    // Params
    const [params, setParams] = useSearchParams()
    const q = params.get('q') || ''
    const searchedRef = useRef(new Set());

    const handleGetAllResults = async (searchValue) => {
        const filters = ["videos", "songs", "albums", "featured_playlists", "playlists", "artists"]

        filters.forEach(async (filter) => {
            try {
                setResults({ [filter]: { isFetching : true} })
                const response = await http.get(`/music/search?q=${searchValue}&filter=${filter}&limit=200`)
                if(response.data.length > 0){
                    setResults({ [filter]: {all : response.data, hasData : true} })
                }else{
                    setResults({ [filter]: {all : [], hasData : false} })
                }
                setResults({ [filter]: { isFetching : false} })
            } catch (error) {
                console.log(error)
            }
        })

        
    }

    const handleSearch = async (searchValue) => {
        const filters = ["videos", "songs", "playlists", "artists", "albums"]
        if(searchValue !== ''){
          setIsSearching(true)
          for (const filter of filters){
            try {
                const response = await http.get(`/music/search?q=${searchValue}&filter=${filter}&limit=20`)
                if(response.data.length > 0){
                  setResults({ [filter]: {partial : response.data, hasData : true} })
                }else{
                    setResults({ [filter]: {partial : [], hasData : false} })
                }
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
        if(!q || searchedRef.current.has(q)) return;

        searchedRef.current.add(q)
        handleSearch(q)
        handleGetAllResults(q)
    }, [q])

  return (
    <main style={{width: width <= 1023 ? '100vw' : '93.5vw'}} className='flex flex-col flex-1 p-5'>
      {
        q === '' ?
        <section className='flex items-center justify-center flex-1'>
          <div className='flex flex-col items-center gap-2'>
          <h1 className='text-4xl font-bold text-center text-white'>Whats on your mind?</h1>
          <p className='text-sm text-center text-gray-400'>Enter a song, artist, album, or playlist to get started</p>
          </div>
        </section>
        :
        <>
        <Tabs />
        {
          isSearching ? <SearchPageLoader />
          :
          <section className='flex flex-col w-full gap-3 overflow-auto '>
                {
                  activeTab === 'songs' ?
                  <SongsTab />
                  :
                  activeTab === 'videos' ?
                  <VideosTab />
                  :
                  activeTab === 'artists' ?
                  <ArtistsTab />
                  :
                  activeTab === 'albums' ?
                  <AlbumsTab />
                  :
                  activeTab === 'playlists' ?
                  <PlaylistsTab />
                  :
                  activeTab === 'all' ?
                  <>
                  {results?.videos?.hasData && <MainVideos />}
                  {results?.songs?.hasData && <MainSongs />}
                  {results?.playlists?.hasData && <MainPlaylists />}
                  {results?.artists?.hasData && <MainArtists />}
                  {results?.albums?.hasData && <MainAlbums />}
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