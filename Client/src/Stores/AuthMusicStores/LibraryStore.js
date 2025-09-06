import { create } from 'zustand'
import http from '../../../http'
import toast, { Toaster } from 'react-hot-toast';
import usePublicAlbumStore from '../PublicAlbumStore';

const useLibraryStore = create((set, get) => ({
  library: null,
  error: null,
  isLoading: true,
  batchSaveToLibrary: async (browseId) => {
    const {getAlbum} = usePublicAlbumStore.getState()
    try {
      const songs = await getAlbum(browseId)
      console.log(songs)
      // const result = await http.post('auth/music/batch_add_to_playlist', data)
      // toast.success(result.data.message);
      // return 'success'

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      set({ error: error.response.data.message })
      return 'error'
    } finally {
        set({ isLoading: false })
    }
  },
  saveToLibrary: async (song) => {
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/save_song/', song)
      toast.success(result.data.message);
      get().getLibrary()

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  },
  getLibrary: async () => {
    set({ isLoading: true })
    try {
      const result = await http.get('auth/music/get_library/')
      set({ library: result.data.data })
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useLibraryStore