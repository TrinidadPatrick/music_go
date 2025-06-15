import { create } from 'zustand'
import http from '../../http'

const useHomeContentStore = create((set) => ({
  homeContents: [],
  error: null,
  isLoading: false,
  getHome: async () => {
    set({ isLoading: true })
    try {
      const result = await http.get('music/home')
      let data = result.data
      let temp = []
      temp = data[0]
      data[0] = data[1]
      data[1] = temp
      set({ homeContents: data })
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useHomeContentStore