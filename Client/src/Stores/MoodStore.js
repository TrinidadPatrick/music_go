import { create } from 'zustand'
import http from '../../http'

const useMoodStore = create((set, get) => ({
  moodCategories: null,
  moodPLaylists: null,
  error: null,
  isLoading: false,
  getMoodCategories: async () => {
    set({ isLoading: true })
    try {
      const result = await http.get(`music/mood_categories`)
      set({ moodCategories: result.data['Moods & moments'] })
      return result.data['Moods & moments']
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  },
  getMoodPlaylist: async (params) => {
    set({ isLoading: true })
    try {
      const result = await http.get(`music/mood_playlist?params=${params}`)
      set({ moodPLaylists: result.data })
      return result.data
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useMoodStore