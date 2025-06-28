import { create } from 'zustand'
import http from '../../http'

const usePublicPlaylistStore = create((set) => ({
  playlist: null,
  error: null,
  isLoading: false,
  getPlaylist: async (playlistId, navigate) => {
    set({ isLoading: true })
    try {
      const result = await http.get('music/playlist?playlistId=' + playlistId)
      set({ playlist: result.data })
      return result.data
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
      navigate('/')
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default usePublicPlaylistStore