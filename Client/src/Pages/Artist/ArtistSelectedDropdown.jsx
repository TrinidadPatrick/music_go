import React, { useCallback, useState } from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore'
import { BookMinus, Disc, Library, Music, Search, Share, X } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import ModalComponent from '../../Components/Modal'
import { useAuth } from '../../Providers/AuthProvider'
import useSongDetails from '../../Stores/SongDetailStore'
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore'
import useArtistDetailStore from '../../Stores/ArtistDetailStore'

const ArtistSelectedDropdown = () => {
    const {user, isAuthenticated, getUser} = useAuth()
    const selectedItem = useSearchPageStore( state => state.selectedItem)
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const saveToLibrary = useLibraryStore( state => state.saveToLibrary)
    const saveToUserPlaylist = useUserPlaylistStore( state => state.saveToUserPlaylist)
    const batchSaveToUserPlaylist = useUserPlaylistStore( state => state.batchSaveToUserPlaylist)
    const library = useLibraryStore( state => state.library)
    const setModalIsOpen = useArtistDetailStore( state => state.setModalIsOpen)
    const modalIsOpen = useArtistDetailStore( state => state.modalIsOpen)
    const getSongDetails = useSongDetails(state => state.getSongDetails)

    const selectPlaylist = async (track) => {
      if(track?.videoId || track?.playlistId || track?.browseId){
        setModalIsOpen(true)
      }
    }

    const isSaved = (videoId) => {
        return library?.library_songs?.some((song) => song.videoId === videoId)
    }

    const handleSaveSong = async (track) => {
        const songDetails = await getSongDetails(track.videoId)
        const data = { ...track, album: null, duration_seconds: Number(songDetails?.videoDetails?.lengthSeconds) || 0 }
        setSelectedItem(null)
        saveToLibrary(data)
    }

    const handleSaveToPlaylist = async (track, playlist) => {
      setModalIsOpen(false)
      // Meaning this is a single music
      if (track?.videoId) {
        const songDetails = await getSongDetails(track.videoId)
        const data = songDetails.videoDetails
        const songData = {
          videoId: track.videoId,
          playlistId: playlist.playlist_id,
          title: track.title,
          artists: track.artists,
          album: null,
          duration_seconds: data.lengthSeconds,
          thumbnails: data.thumbnail ? data.thumbnail.thumbnails : null,
        }
        const result = await saveToUserPlaylist(songData)
        if (result === 'success') {
          setSelectedItem(null)
          getUser()
        }
      
      //Meaning to add a whole playlist or album
      }else if(track?.playlistId || track?.browseId){
       const type = track?.playlistId ? 'playlist' : 'album'
       const id = track?.playlistId || track?.browseId
       const result = await batchSaveToUserPlaylist(id, playlist?.playlist_id, type)
        if (result === 'success') {
          setSelectedItem(null)
          getUser()
        }
      }
    }

    const Modal = useCallback(() => {
        return (
          <ModalComponent open={modalIsOpen} setOpen={setModalIsOpen}>
            <div className='flex flex-col gap-2 bg-gray-800 max-w-[500px] w-[500px]'>
              {/* Header */}
              <header className='relative p-5 border-b border-b-slate-700'>
                <h1 className='text-2xl font-bold text-white'>Add to Playlist</h1>
    
                <div className='flex items-center gap-2 text-sm'>
                  <span className='text-gray-400 line whitespace-nowrap'>{selectedItem?.title}</span>
                  <div className='w-1 h-1 bg-gray-400 rounded-full' />
                  <span className='text-gray-400 line-clamp-1'>
                    {selectedItem?.artists ? selectedItem?.artists.map((artist) => artist.name).join(', ') : ''}
                  </span>
                </div>
    
                <button className='absolute cursor-pointer right-3 top-3' onClick={(e) => {e.stopPropagation(); setModalIsOpen(false)}}>
                  <X size={20} className="text-slate-400 hover:text-white" />
                </button>
              </header>
    
              {/* Search playlist */}
              <div className="flex-shrink-0 p-5 border-b border-slate-700">
                <div className="relative">
                  <Search size={20} className="absolute transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search playlists..."
                    className="w-full py-2 pl-10 pr-4 text-white transition-all border rounded-lg bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
    
              {/* Playlists */}
              <div className='flex flex-col p-4 gap-4 max-h-[400px] overflow-y-auto'>
                {user && user?.user?.playlists.map((playlist, index) => {
                  return (
                    <button 
                      key={index} 
                      onClick={(e) => {e.stopPropagation(); handleSaveToPlaylist(selectedItem, playlist)}}
                      className='flex w-full gap-2 p-1 rounded cursor-pointer hover:bg-gray-700'
                    >
                      {/* Thumbnail */}
                      <div className='h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded'>
                        {playlist.thumbnal ? (
                          <img src={playlist.thumbnail} alt={playlist.title} className='object-cover w-full h-full' />
                        ) : (
                          <Music size={25} className='text-white' />
                        )}
                      </div>
                      {/* Title */}
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-white text-start'>{playlist.title}</p>
                        <p className='text-sm text-gray-400 text-start'>{playlist.song_count} songs</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </ModalComponent>
        )
      }, [modalIsOpen, selectedItem])

  return (
    <div className='absolute w-48 text-white bg-gray-800 rounded shadow-lg z-90'>
        <Modal />
        <ul className="p-2 space-y-2 text-sm text-white">
          {selectedItem?.videoId && isAuthenticated && (
            <li 
              onClick={(e) => { e.stopPropagation(); handleSaveSong(selectedItem) }} 
              className={`hover:bg-gray-700 ${isSaved(selectedItem?.videoId) ? 'text-red-500' : ''} cursor-pointer p-2 rounded flex items-center gap-2`}
            >
              {isSaved(selectedItem?.videoId) ? 
                <BookMinus size={16} className='text-red-500' /> : 
                <Library size={16} className='text-gray-400' />
              }
              {isSaved(selectedItem?.videoId) ? 'Remove from Library' : 'Add to Library'}
            </li>
          )}
          {
            isAuthenticated && (
              <li 
            onClick={(e) => { e.stopPropagation(); selectPlaylist(selectedItem) }} 
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700"
          >
            <Disc size={16} className='text-gray-400' />
            Add to Playlist
          </li>
            )
          }
          <li className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700">
            <Share size={16} className='text-gray-400' />
            Share
          </li>
        </ul>
    </div>
  )
}

export default ArtistSelectedDropdown