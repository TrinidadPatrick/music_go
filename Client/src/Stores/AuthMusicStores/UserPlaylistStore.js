import { create } from 'zustand'
import http from '../../../http'
import toast, { Toaster } from 'react-hot-toast';

const useUserPlaylistStore = create((set, get) => ({
  userPlaylist: null,
  error: null,
  isLoading: true,

  saveToUserPlaylist: async (song) => {
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/add_to_playlist', song)
      toast.success(result.data.message);
      return 'success'

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
      set({ error: error.response.data.message })
      return 'error'
    } finally {
        set({ isLoading: false })
    }
  },

  createPlaylist: async (data, notify) => {
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/create_playlist', data)
      if(result.status === 200){
        notify(result.data.message)
        get().getUserPlaylists()
      }
      

    } catch (error) {
      console.log(error)
      // navigate('/')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  },

  getUserPlaylists: async () => {
    set({ isLoading: true })
    try {
      const result = await http.get('auth/music/get_playlists')
      set({ userPlaylist: result.data.data })
    } catch (error) {
      console.log(error)
    //   navigate('/home')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
  }))

export default useUserPlaylistStore