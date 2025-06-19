import { create } from 'zustand'

const useSidebarStore = create((set, get) => ({
    isSidebarOpen: false,
    setIsSidebarOpen: (isSidebarOpen) => {
        set({ isSidebarOpen })
    }
}))

export default useSidebarStore