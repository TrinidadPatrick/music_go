import { create } from 'zustand'
import http from '../../../http'

const useLibraryStore = create((set, get) => ({
  library: null,
  error: null,
  isLoading: false,
  saveToLibrary: async (song, notify) => {
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/save_song', song)
      notify(result.data.message)
      get().getLibrary()

    } catch (error) {
      console.log(error)
      // navigate('/')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  },
  getLibrary: async () => {
    set({ isLoading: true })
    try {
      const result = await http.get('auth/music/get_library')
      set({ library: result.data.data })
    } catch (error) {
      console.log(error)
    //   navigate('/home')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useLibraryStore