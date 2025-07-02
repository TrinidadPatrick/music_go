import { create } from 'zustand'
import http from '../../http'

const useLyricsStore = create((set, get) => ({
  lyrics: null,
  error: null,
  isLoading: false,
  getLyrics: async (browseId) => {
    set({ isLoading: true })
    try {
      const result = await http.get(`music/lyrics?browseId=${browseId}`)
      set({ lyrics: result.data })
      return result.data
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useLyricsStore