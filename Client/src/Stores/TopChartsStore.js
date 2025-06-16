import { create } from 'zustand'
import http from '../../http'
import useSongDetails from './SongDetailStore'
import limit from 'p-limit';

function parseCompactNumber(text) {
  const units = {
    K: 1_000,
    M: 1_000_000,
    B: 1_000_000_000,
    T: 1_000_000_000_000
  }

  const match = text.match(/^([\d,.]+)([KMBT])?$/i)
  if (!match) return NaN

  const [, numStr, unit] = match
  const num = parseFloat(numStr.replace(/,/g, ''))

  return unit ? num * units[unit.toUpperCase()] : num
}

const useChartsStore = create((set) => ({
  charts: [],
  error: null,
  isLoading: false,
  getCharts: async (retries = 10) => {
    set({ isLoading: true })
    try {
      const result = await http.get('music/charts')
      if(result.status === 200 && result.data){
        set({ charts: result.data.videos.items.sort((a,b) => Number(parseCompactNumber(b.views)) - Number(parseCompactNumber(a.views))) })
      }
    } catch (error) {
      console.log(error)
      set({ error: error.response.data.message })
      if(retries > 0){
        setTimeout(() => {
          getCharts(retries - 1)
        }, 1000)
      }
    } finally {
        set({ isLoading: false })
    }
  }
}))

export default useChartsStore