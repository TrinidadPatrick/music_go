import { create } from 'zustand'
import http from '../../http'

const useSongDetails = create((set) => ({
  songDetails: null,
  error: null,
  isLoading: false,
  getSongDetails: async (videoId) => {
    set({ isLoading: true })
    try {
        const result = await http.get(`music/song?videoId=${videoId}`)
        return result.data
    } catch (error) {
        console.log(error)
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useSongDetails