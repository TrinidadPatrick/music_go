import { create } from 'zustand'
import http from '../../http'

const useGetSongRecommendation = create((set) => ({
  album: [],
  error: null,
  isLoading: false,
  getSongRecommendation: async (videoId, navigate) => {
    if(videoId){
        set({ isLoading: true })
    try {
      const result = await http.get('music/next_song_reco?videoId=' + videoId)
      return result.data
    //   set({ album: result.data })
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
    }
  }
}))

export default useGetSongRecommendation