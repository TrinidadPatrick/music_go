import React, { useCallback, useState } from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore'
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore'
import { BookMinus, Disc, Library, Music, Search, Share, X } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import ModalComponent from '../../Components/Modal'
import { useAuth } from '../../Auth/AuthProvider'
import useSongDetails from '../../Stores/SongDetailStore'
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore'

const SelectedDropdown = () => {
    const {user, isAuthenticated, getUser} = useAuth()
    const selectedItem = useSearchPageStore( state => state.selectedItem)
    const setSelectedItem = useSearchPageStore( state => state.setSelectedItem)
    const saveToLibrary = useLibraryStore( state => state.saveToLibrary)
    const saveToUserPlaylist = useUserPlaylistStore( state => state.saveToUserPlaylist)
    const library = useLibraryStore( state => state.library)
    const setModalIsOpen = useSearchPageStore( state => state.setModalIsOpen)
    const modalIsOpen = useSearchPageStore( state => state.modalIsOpen)
    const getSongDetails = useSongDetails(state => state.getSongDetails)

    const selectPlaylist = async (track) => {
        setModalIsOpen(true)
      }

    const isSaved = (videoId) => {
        return library?.library_songs?.some((song) => song.videoId === videoId)
    }

    const handleSaveSong = (track) => {
        const data = { ...track, album: null }
        setSelectedItem(null)
        saveToLibrary(data)
    }

    const handleSaveToPlaylist = async (track, playlist) => {
        setModalIsOpen(false)
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
                  <div className='w-1 h-1 rounded-full bg-gray-400' />
                  <span className='text-gray-400 line-clamp-1'>
                    {selectedItem?.artists ? selectedItem?.artists.map((artist) => artist.name).join(', ') : ''}
                  </span>
                </div>
    
                <button className='absolute right-3 top-3 cursor-pointer' onClick={() => setModalIsOpen(false)}>
                  <X size={20} className="text-slate-400 hover:text-white" />
                </button>
              </header>
    
              {/* Search playlist */}
              <div className="border-b border-slate-700 flex-shrink-0 p-5">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search playlists..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
    
              {/* Playlists */}
              <div className='flex flex-col p-4 gap-4 max-h-[400px] overflow-y-auto'>
                {user && user?.user?.playlists.map((playlist, index) => {
                  return (
                    <button 
                      key={index} 
                      onClick={() => handleSaveToPlaylist(selectedItem, playlist)} 
                      className='w-full flex gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded'
                    >
                      {/* Thumbnail */}
                      <div className='h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded'>
                        {playlist.thumbnal ? (
                          <img src={playlist.thumbnail} alt={playlist.title} className='w-full h-full object-cover' />
                        ) : (
                          <Music size={25} className='text-white' />
                        )}
                      </div>
                      {/* Title */}
                      <div className='flex-1 min-w-0'>
                        <p className='text-white text-start text-sm font-medium'>{playlist.title}</p>
                        <p className='text-gray-400 text-start text-sm'>{playlist.song_count} songs</p>
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
    <div className='absolute text-white shadow-lg bg-gray-800 rounded w-48 z-90'>
        <Modal />
        <ul className="text-sm text-white p-2 space-y-2">
          {selectedItem?.videoId && (
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
          <li 
            onClick={(e) => { e.stopPropagation(); selectPlaylist(selectedItem) }} 
            className="hover:bg-gray-700 p-2 rounded flex items-center gap-2 cursor-pointer"
          >
            <Disc size={16} className='text-gray-400' />
            Add to Playlist
          </li>
          <li className="hover:bg-gray-700 p-2 rounded flex items-center gap-2 cursor-pointer">
            <Share size={16} className='text-gray-400' />
            Share
          </li>
        </ul>
    </div>
  )
}

export default SelectedDropdown