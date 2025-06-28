import { create } from 'zustand'
import http from '../../../http'
import toast, { Toaster } from 'react-hot-toast';
import usePublicPlaylistStore from '../PublicPlaylistStore';
import usePublicAlbumStore from '../PublicAlbumStore';

const useUserPlaylistStore = create((set, get) => ({
  playlistDetail: null,
  userPlaylist: null,
  error: null,
  isLoading: true,
  getPlaylistDetail: async (playlistId) => {
    set({playlistDetail: null, playlistSongs: null})
    try {
      const result = await http.get(`auth/music/get_playlist_details?playlistId=${playlistId}`)
      set({ playlistDetail: result.data.data })
      return result.data
    } catch (error) {
      window.location.href = '/'
      console.log(error)
      set({ error: error.response.data.message })
    }
  },
  saveToUserPlaylist: async (song) => {
    set({ isLoading: true })
    try {
      const result = await http.post('auth/music/add_to_playlist', song)
      toast.success(result.data.message);
      return 'success'

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong, try again later');
      set({ error: error.response.data.message })
      return 'error'
    } finally {
        set({ isLoading: false })
    }
  },

  batchSaveToUserPlaylist: async (id, userPlaylistId, type) => {
    const {getPlaylist} = usePublicPlaylistStore.getState()
    const {getAlbum} = usePublicAlbumStore.getState()
    set({ isLoading: true })
    try {
      const songs =  type === 'playlist' ? await getPlaylist(id) : await getAlbum(id)
      const data = {
        playlistId: userPlaylistId,
        songs: songs.tracks
      }
      const result = await http.post('auth/music/batch_add_to_playlist', data)
      toast.success(result.data.message);
      return 'success'

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong, try again later');
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
      if(result.data){
        set({ userPlaylist: result.data.data })
      }else{
        set({ userPlaylist: {total_playlists: 0, playlists: []}})
      }
    } catch (error) {
      console.log(error)
    //   navigate('/home')
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  },

  removeFromPlaylist: async (videoId, playlistId) => {
    set({ isLoading: true })
    try {
      const result = await http.delete(`auth/music/remove_from_playlist?songId=${videoId}&playlistId=${playlistId}`)
      toast.success(result.data.message);
      return 'success'

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message || 'Something went wrong, try again later');
      set({ error: error.response.data.message })
      return 'error'
    } finally {
        set({ isLoading: false })
    }
  },
  }))

export default useUserPlaylistStore