import React, { useCallback, useEffect, useState, useMemo } from 'react'
import useHomeContentStore from '../../Stores/HomeContentStore'
import { Play, MoreHorizontal, Music, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useGetSongRecommendation from '../../Stores/NextSongRecommendationStore'
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore'
import useSongDetails from '../../Stores/SongDetailStore'
import { Toaster } from 'react-hot-toast'
import EqualizerAnimation from '../../Components/EqualizerAnimation'
import { useAuth } from '../../Auth/AuthProvider'
import ModalComponent from '../../Components/Modal'
import useUserPlaylistStore from '../../Stores/AuthMusicStores/UserPlaylistStore'
import MainDropDown from './MainDropdown'
import HomeLoader from './HomeLoader'

const HomeContents = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, getUser } = useAuth()
  const [selectedDropdown, setSelectedDropdown] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Store selectors
  const homeContents = useHomeContentStore(state => state.homeContents)
  const getHome = useHomeContentStore(state => state.getHome)
  const setSongList = useMusicPlayerStore(state => state.setSongList)
  const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
  const currentSong = useMusicPlayerStore(state => state.currentSong)
  const getSongRecommendation = useGetSongRecommendation(state => state.getSongRecommendation)
  const library = useLibraryStore(state => state.library)
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const getSongDetails = useSongDetails(state => state.getSongDetails)
  const saveToUserPlaylist = useUserPlaylistStore(state => state.saveToUserPlaylist)
  const batchSaveToUserPlaylist = useUserPlaylistStore(state => state.batchSaveToUserPlaylist)

  useEffect(() => {
    homeContents.length === 0 && getHome()
  }, [])

  const handleSelect = async (track) => {
    if (track?.playlistId) {
      navigate(`/public/playlist?list=${track.playlistId}`)
    } else if (track?.type === 'Album' && track?.browseId) {
      navigate(`/public/album?list=${track.browseId}`)
    } else if (track?.videoId) {
      if (currentSong?.videoId !== track.videoId) {
        setCurrentSong(track)
        try {
          const songList = await getSongRecommendation(track.videoId)
          if (songList?.tracks) {
            setSongList(songList.tracks)
          }
        } catch (error) {
          console.error('Failed to get song recommendations:', error)
        }
      }
    }
  }

  const handleMoreOption = (track) => {
    setSelectedDropdown(prev => prev === track ? null : track)
  }

  const isSaved = (videoId) => {
    return library?.library_songs?.some((song) => song.videoId === videoId) || false
  }

  const handleSaveToLibrary = async (track) => {
    if (!track?.videoId) return
    
    try {
      setSelectedDropdown(null)
      const songDetails = await getSongDetails(track.videoId)
      const data = songDetails.videoDetails
      const songData = {
        videoId: data.videoId,
        title: data.title,
        artists: [{ name: data.author }],
        album: null,
        duration_seconds: data.lengthSeconds,
        thumbnails: data.thumbnail?.thumbnails || null,
      }
      await saveToLibrary(songData)
    } catch (error) {
      console.error('Failed to save to library:', error)
    }
  }

  const selectPlaylist = (track) => {
    if (track?.videoId || track?.playlistId || track?.browseId) {
      setModalIsOpen(true)
    }
  }

  const handleSaveToPlaylist = async (track, playlist) => {
    setModalIsOpen(false)
    
    try {
      if (track?.videoId) {
        // Single music
        const songDetails = await getSongDetails(track.videoId)
        const data = songDetails.videoDetails
        const songData = {
          videoId: track.videoId,
          playlistId: playlist.playlist_id,
          title: track.title,
          artists: track.artists,
          album: null,
          duration_seconds: data.lengthSeconds,
          thumbnails: data.thumbnail?.thumbnails || null,
        }
        const result = await saveToUserPlaylist(songData)
        if (result === 'success') {
          setSelectedDropdown(null)
          getUser()
        }
      } else if (track?.playlistId || track?.browseId) {
        // Whole playlist or album
        const type = track?.playlistId ? 'playlist' : 'album'
        const id = track?.playlistId || track?.browseId
        const result = await batchSaveToUserPlaylist(id, playlist?.playlist_id, type)
        if (result === 'success') {
          setSelectedDropdown(null)
          getUser()
        }
      }
    } catch (error) {
      console.error('Failed to save to playlist:', error)
    }
  }
  // Handle modal close
  const handleModalClose = () => {
    setModalIsOpen(false)
    setSearchValue('')
  }

  const TrackItem = useCallback(({ track, index, isQuickPicks = false, isMobile = false }) => {
    const show = selectedDropdown === track
    const isCurrentSong = track?.videoId && currentSong?.videoId === track.videoId
    const formatArtists = (artists) => artists?.map(a => a.name).join(', ') || ''
    if (isQuickPicks) {
      return (
        <div
          onClick={() => handleSelect(track)}
          className={`group relative w-full cursor-pointer bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
          rounded-2xl p-3 transition-all duration-500 hover:shadow-2xl border border-white/10 
          flex gap-3 justify-between items-center ${show ? 'z-50' : 'z-10'}`}
        >
          {show && 
            <div className='absolute z-[100] right-10 top-9 mt-1'>
              <MainDropDown track={track} onSave={handleSaveToLibrary} onSelectPlaylist={selectPlaylist} isSaved={isSaved} />
            </div>
          }
          
          {/* Hover overlay */}
          <div className={`${isCurrentSong ? 'block' : 'hidden'} group-hover:block w-full h-full opacity-50 bg-gray-800 rounded-2xl absolute top-0 left-0 z-10`} />

          {/* Image and Title */}
          <div className='relative z-20 flex items-center flex-1 min-w-0 gap-3'>
            {!isMobile && (
              <div className='flex items-center h-full gap-3'>
                <span className='w-6 text-center text-gray-200'>{index + 1}</span>
              </div>
            )}
            <div className='flex-none'>
              <img 
                src={track?.thumbnails?.[0]?.url} 
                alt={track.title} 
                className='object-cover rounded-lg w-14 h-14 aspect-square' 
              />
            </div>
            <div className='flex flex-col justify-center flex-1 min-w-0 gap-1'>
              <h1 className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-gray-200'} line-clamp-1`}>
                {track.title}
              </h1>
              <p className='text-sm text-gray-400 line-clamp-1'>
                {formatArtists(track.artists)}{track.plays ? `, ${track.plays}` : ''}
              </p>
            </div>
          </div>

          {/* More button */}
          {isAuthenticated && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleMoreOption(track)
              }}
              className="relative z-30 flex-none p-1 transition-opacity duration-200 opacity-0 cursor-pointer group-hover:opacity-100 hover:bg-gray-500 hover:rounded-full"
            >
              <MoreHorizontal size={20} className="text-white" />
            </button>
          )}
        </div>
      )
    }

    // Card layout for other sections
    return (
      <div
        onClick={() => handleSelect(track)}
        className={`group cursor-pointer relative bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-lg 
          rounded-2xl p-3 transition-all duration-500 hover:shadow-2xl border border-white/10 
          flex-shrink-0 w-45 md:w-60 overflow-hidden flex flex-col ${show ? 'z-50' : 'z-10'}`}
      >
        {isAuthenticated && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMoreOption(track)
            }}
            className="absolute z-50 p-1 cursor-pointer md:hidden md:group-hover:block hover:bg-gray-500 hover:rounded-full right-5"
          >
            <MoreHorizontal size={20} className="relative z-10 text-white" />
            {show && (
              <div className="absolute right-0 top-full mt-1 z-[100]">
                <MainDropDown
                track={track}
                onSave={handleSaveToLibrary}
                onSelectPlaylist={selectPlaylist}
                isSaved={isSaved}          
                />
              </div>
            )}
          </button>
        )}

        <button
          className={`p-3 ${
            isCurrentSong ? 'block' : 'hidden'
          } cursor-pointer w-14 h-14 justify-center items-center group-hover:flex rounded-full bg-white/80 shadow-2xl absolute z-40 left-1/2 transform -translate-x-1/2 top-24`}
        >
          {isCurrentSong ? (
            <EqualizerAnimation />
          ) : (
            <Play className="flex items-center justify-center text-gray-700 transition-transform duration-200 cursor-pointer" />
          )}
        </button>

        <div
          className={`${
            isCurrentSong ? 'block' : 'hidden'
          } group-hover:block w-full h-full opacity-50 brightness-0 z-20 bg-black absolute top-0 left-0`}
        />

        <div
          className="flex items-center justify-center w-full bg-center bg-no-repeat bg-cover rounded-lg opacity-75 aspect-square"
          style={{
            backgroundImage: `url(${track?.thumbnails?.[1]?.url || track?.thumbnails?.[0]?.url})`,
          }}
        />

        <div className="flex flex-col gap-1 mt-2">
          <h3 className="text-[0.8rem] sm:text-sm md:text-base text-white line-clamp-2 text-start font-medium">
            {track?.title}
          </h3>
          <p className="text-[0.7rem] sm:text-xs md:text-sm text-gray-400">
            {formatArtists(track?.artists)}
          </p>
        </div>
      </div>
    )
  }, [selectedDropdown, currentSong?.videoId, handleSelect, MainDropDown, isAuthenticated, handleMoreOption])

  return (
    <main className="flex flex-col w-full gap-4 p-2 md:p-6">
      {/* Move Modal outside of conditional rendering */}
      <ModalComponent open={modalIsOpen} setOpen={handleModalClose}>
        <div className="flex flex-col gap-2 bg-gray-800 max-w-[500px] w-[400px] sm:w-[500px]">
          <header className="relative p-5 border-b border-b-slate-700">
            <h1 className="text-2xl font-bold text-white">Add to Playlist</h1>
            <div className="flex flex-col items-start mt-2 text-sm">
              <p className="overflow-hidden text-gray-400 whitespace-nowrap line-clamp-1">{selectedDropdown?.title}</p>
              <p className="overflow-hidden text-xs text-gray-400 whitespace-nowrap line-clamp-1">
                {selectedDropdown?.artists?.map((artist) => artist.name).join(', ') || ''}
              </p>
            </div>
            <button
              className="absolute cursor-pointer right-3 top-3"
              onClick={handleModalClose}
            >
              <X size={20} className="text-slate-400 hover:text-white" />
            </button>
          </header>

          <div className="flex flex-col p-4 gap-4 max-h-[400px] overflow-y-auto">
            {user?.user?.playlists.map((playlist, index) => (
              <button
                key={`${playlist.playlist_id}-${index}`}
                onClick={() => handleSaveToPlaylist(selectedDropdown, playlist)}
                className="flex w-full gap-2 p-1 transition-colors duration-150 rounded cursor-pointer hover:bg-gray-700"
              >
                <div className="h-[40px] aspect-square bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded flex-shrink-0">
                  {playlist.thumbnail ? (
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className="object-cover w-full h-full rounded"
                      loading="lazy"
                    />
                  ) : (
                    <Music size={25} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate text-start">{playlist.title}</p>
                  <p className="text-sm text-gray-400 text-start">{playlist.song_count} songs</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ModalComponent>

      {
      homeContents.length === 0 ? <HomeLoader /> :
      homeContents.map((content, index) => {
        const isQuickPicks = content?.title === "Quick picks"
        
        return (
          <div key={`${content.title}-${index}`} className="flex flex-col gap-3">
            <div>
              <h2 className="font-bold text-white sm:text-lg md:text-2xl">{content.title}</h2>
            </div>

            {isQuickPicks ? (
              <>
                {/* Mobile: Single column */}
                <div className="relative flex flex-col gap-3 md:hidden">
                  {content?.contents?.map((track, trackIndex) => (
                    <TrackItem 
                      key={`mobile-${track.videoId || track.playlistId || track.browseId}-${trackIndex}`}
                      track={track} 
                      index={trackIndex} 
                      isQuickPicks={true} 
                      isMobile={true} 
                    />
                  ))}
                </div>

                {/* Desktop: Grid layout */}
                <div className="relative hidden gap-3 md:grid md:grid-cols-2">
                  {content?.contents?.map((track, trackIndex) => (
                    <TrackItem 
                      key={`desktop-${track.videoId || track.playlistId || track.browseId}-${trackIndex}`}
                      track={track} 
                      index={trackIndex} 
                      isQuickPicks={true} 
                      isMobile={false} 
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex gap-3 overflow-x-auto md:p-3 hide-scrollbar">
                <div className="flex gap-3 w-max">
                  {content?.contents?.map((track, trackIndex) => (
                    <TrackItem 
                      key={`card-${track?.videoId || track?.playlistId || track?.browseId}-${trackIndex}`}
                      track={track} 
                      index={trackIndex} 
                      isQuickPicks={false} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })
      }
      <Toaster position="bottom-right" />
    </main>
  )
}

export default HomeContents