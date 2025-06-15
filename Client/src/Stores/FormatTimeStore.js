import { create } from 'zustand'

const useFormatTimeStore = create((set) => ({
  formatTime: (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
}))

export default useFormatTimeStore