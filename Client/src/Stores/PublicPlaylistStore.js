import { create } from 'zustand'
import http from '../../http'

const usePublicPlaylistStore = create((set) => ({
  playlist: [],
  error: null,
  isLoading: false,
  getPlaylist: async (playlistId, navigate) => {
    set({ isLoading: true })
    try {
      const result = await http.get('music/playlist?playlistId=' + playlistId)
      set({ playlist: result.data })
    } catch (error) {
      console.log(error)
      navigate('/home')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default usePublicPlaylistStore