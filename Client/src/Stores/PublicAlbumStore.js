import { create } from 'zustand'
import http from '../../http'

const usePublicAlbumStore = create((set) => ({
  album: null,
  error: null,
  isLoading: false,
  getAlbum: async (browseId, navigate) => {
    set({ isLoading: true })
    try {
      const result = await http.get('music/album?browseId=' + browseId)
      set({ album: result.data })
      return result.data
    } catch (error) {
      console.log(error)
      navigate('/')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default usePublicAlbumStore