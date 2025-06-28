import { create } from 'zustand'
import http from '../../http'

const useArtistDetailStore = create((set, get) => ({
  activeTab: 'featured',
  setActiveTab: (activeTab) => {
    set({ activeTab })
  },
  modalIsOpen: false,
  setModalIsOpen: (modalIsOpen) => {
        set({ modalIsOpen })
  },
  selectedItem: null,
  setSelectedItem: (selectedItem) => {
    if(get().selectedItem !== selectedItem){
      set({ selectedItem })
    }
  },
  artist: null,
  artistData: {
    songs: {
        partial: null,
        all: null,
        hasData: null,
        isFetching: null,
        browseId: null,
        params: null
      },
      videos: {
        partial: null,
        all: null,
        hasData: null,
        isFetching: null,
        browseId: null,
        params: null
      },
      albums: {
        partial: null,
        all: null,
        hasData: null,
        isFetching: null,
        browseId: null,
        params: null
      },
      singles: {
        partial: null,
        all: null,
        hasData: null,  
        isFetching: null,
        browseId: null,
        params: null
      }
  },

  setArtistData: (artistData) => {
    set((state) => ({
      artistData: {
        ...state.artistData,
        ...Object.fromEntries(
          Object.entries(artistData).map(([key, value]) => [
            key,
            {
              ...state.artistData[key],
              ...value,
            },
          ])
        ),
      }
    }))
  },

}))

export default useArtistDetailStore