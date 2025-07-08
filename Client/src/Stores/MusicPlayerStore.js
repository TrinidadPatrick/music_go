import { create } from 'zustand'
import useGetSongRecommendation from './NextSongRecommendationStore'
import useSongDetails from './SongDetailStore'
import useLyricsStore from './LyricsStore'
import http from '../../http'

const useMusicPlayerStore = create((set, get) => ({
  // State
  songList: [],
  currentSong: null,
  songDetails: null,
  lyrics: null,
  isLoading: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 100,
  isReady: false,
  error: null,
  playerRef: null,

  repeatSetting: 'off',
  shuffleOn: false,
  fullScreen: false,

  getWatchPlaylist: async (videoId) => {
    try {
      const result = await http.get(`music/get_watch_playlist?videoId=${videoId}`)
      return result.data
    } catch (error) {
      console.log(error)
    }
  },

  setFullScreen: (fullScreen) => set({ fullScreen }),
  toggleFullScreen: () => set({ fullScreen: !get().fullScreen }),

  toggleShuffle: () => {
    set({ shuffleOn: !get().shuffleOn })
  },

  setPlayerRef: (value) => {set({playerRef : value})},

  // Added repeat setting
  setRepeatSetting: (repeatSetting) => set({ repeatSetting }),

  // Added list of songs to play
  setSongList: (songList) => set({ songList }),
  
  // Actions
  setCurrentSong: async (song) => {
    set({lyrics : null})
    const getSongDetails = useSongDetails.getState().getSongDetails
    const getLyrics = useLyricsStore.getState().getLyrics

    // Prevent crashing when playing same song
    if(get().currentSong === song) {
      get().playerRef.current.seekTo(0, true)
      get().playerRef.current.playVideo()
      return
    };

    // Set the current song
    set({ 
      currentSong: song, 
      isLoading: true,
      currentTime: 0,
      duration: 0 
    })

    // Get the song details
    const songDetails = await getSongDetails(song.videoId)

    if(songDetails){
      set({songDetails : songDetails})
    }

    // Get the lyrics browseId
    const songLyrics = await get().getWatchPlaylist(song.videoId)
    if(songLyrics?.lyrics){
      const lyrics = await getLyrics(songLyrics?.lyrics)
      if(lyrics){
        set({lyrics : lyrics})
      }
    }

  },

  playPrevSong: () => {
    const currentSongIndex = get().songList.findIndex((song) => song.videoId === get().currentSong.videoId)
    if(currentSongIndex > 0){
      const nextSong = get().songList[currentSongIndex - 1]
      set({ currentSong: nextSong })
    }else{
      get().playerRef.current.seekTo(0, true)
        get().playerRef.current.playVideo()
    }
  },

  playNextSong: async () => {
    const getSongRecommendation = useGetSongRecommendation.getState().getSongRecommendation
    const currentSongIndex = get().songList.findIndex((song) => song.videoId === get().currentSong.videoId)

    // If current song is at the end of song list, provide a new set of songs
    if(currentSongIndex === get().songList.length - 1){
      const songRecommendations = await getSongRecommendation(get().currentSong.videoId)
      const newSongs = songRecommendations.tracks.filter((song) => song.videoId !== get().currentSong.videoId)
      if(songRecommendations){
        const newSongList = [...get().songList]
        newSongList.push(...newSongs)
        set({ songList:  newSongList})
      }
    }

    const nextSong = get().songList[currentSongIndex + 1]

    if(get().songList.length === 0){
      const songRecommendations = await getSongRecommendation(get().currentSong.videoId)
      if(songRecommendations){
        set({ songList: songRecommendations.tracks })
      }
      get().resetPlayer()
      return
    }

    switch(get().repeatSetting){
      case 'off':
        if(nextSong){
          if(get().shuffleOn){
            const index = Math.floor(Math.random() * get().songList.length);
            get().setCurrentSong(get().songList[index])
          }else{
            get().setCurrentSong(nextSong)
          }
        }else{
          get().playerRef.current.seekTo(0, true)
          get().playerRef.current.pauseVideo()
        }
        break
      case 'one':
        get().playerRef.current.seekTo(0, true)
        get().playerRef.current.playVideo()
        break
      case 'all':
        if(nextSong){
          if(get().shuffleOn){
            const index = Math.floor(Math.random() * get().songList.length);
            get().setCurrentSong(get().songList[index])
          }else{
            set({ currentSong: nextSong })
          }
        }else{
          get().setCurrentSong(get().songList[0])
        }
        break
      default:
        break
    }
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setIsReady: (isReady) => set({ isReady }),
  setError: (error) => set({ error }),
  
  // Reset player state
  resetPlayer: () => set({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isReady: false,
    error: null
  })
}))

export default useMusicPlayerStore