import { create } from 'zustand'
import useGetSongRecommendation from './NextSongRecommendationStore'
import useSongDetails from './SongDetailStore'

const useMusicPlayerStore = create((set, get) => ({
  // State
  songList: [],
  currentSong: null,
  songDetails: null,
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
    const getSongDetails = useSongDetails.getState().getSongDetails
    if(get().currentSong === song) {
      get().playerRef.current.seekTo(0, true)
      get().playerRef.current.playVideo()
      return
    };
    const songDetails = await getSongDetails(song.videoId)
    console.log(songDetails)
    if(songDetails){
      set({songDetails : songDetails})
    }
    set({ 
      currentSong: song, 
      isLoading: true,
      currentTime: 0,
      duration: 0 
    })

  },

  playNextSong: async () => {
    const getSongRecommendation = useGetSongRecommendation.getState().getSongRecommendation
    const currentSongIndex = get().songList.findIndex((song) => song.videoId === get().currentSong.videoId)
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
            set({ currentSong: get().songList[index] })
          }else{
            set({ currentSong: nextSong })
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
            set({ currentSong: get().songList[index] })
          }else{
            set({ currentSong: nextSong })
          }
        }else{
          set({currentSong: get().songList[0]})
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