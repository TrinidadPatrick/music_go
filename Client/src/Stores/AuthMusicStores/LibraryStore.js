import { create } from 'zustand'
import http from '../../../http'

const useLibraryStore = create((set) => ({
  library: null,
  error: null,
  isLoading: false,
  saveToLibrary: async (song, navigate) => {
    console.log(song)
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/save_song', song)
      console.log(result.data)
    //   set({ album: result.data })
    } catch (error) {
      console.log(error)
    //   navigate('/home')
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