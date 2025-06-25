import { create } from 'zustand'

const useSearchPageStore = create((set, get) => ({
    isSearching: true,
    setIsSearching: (isSearching) => {
      set({ isSearching })
    },
    setSearchInput: (searchInput) => {
        set({ searchInput })
    },
    results: {
        videos: {
          partial: null,
            all : null
        },
        songs: {
            partial: null,
            all : null
        },
        albums: [],
        artists: [],
        playlists: [],
        featured_playlists: []
    },
    setResults: (results) => {
        set((state) => ({
          results: {
            ...state.results,
            ...Object.fromEntries(
              Object.entries(results).map(([key, value]) => [
                key,
                {
                  ...state.results[key],
                  ...value,
                },
              ])
            ),
          }
        }))
      },

    modalIsOpen: false,
    setModalIsOpen: (modalIsOpen) => {
        set({ modalIsOpen })
    },

    activeTab: 'all',
    setActiveTab: (activeTab) => {
        set({ activeTab })
    },

    selectedItem: null,
    setSelectedItem: (selectedItem) => {
        if(get().selectedItem !== selectedItem){
            set({ selectedItem })
        }
    }
}))

export default useSearchPageStore