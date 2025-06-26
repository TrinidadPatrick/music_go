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
            all : null,
            isFetching: null,
            hasData: null,
        },
        songs: {
            partial: null,
            all : null,
            isFetching: null,
            hasData: null,
        },
        albums: {
          partial: null,
            all : null,
            isFetching: null,
            hasData: null,
        },
        artists: {
          partial: null,
            all : null,
            isFetching: null,
            hasData: null,
        },
        playlists: {
          partial: null,
            all : null,
            isFetching: null,
            hasData: null,
        }
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