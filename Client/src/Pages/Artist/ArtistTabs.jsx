import React from 'react'
import useArtistDetailStore from '../../Stores/ArtistDetailStore';

const ArtistTabs = () => {
    const activeTab = useArtistDetailStore( state => state.activeTab)
    const setActiveTab = useArtistDetailStore( state => state.setActiveTab)

    const tabs = [
        { id: 'featured', label: 'Featured' },
        { id: 'videos', label: 'Videos' },
        { id: 'songs', label: 'Songs' },
        { id: 'albums', label: 'Albums' },
    ];
    
  return (
    <div className="flex space-x-6 border-b border-gray-700 w-full overflow-x-scroll min-h-[35px]  hide-scrollbar">
            {tabs.map((tab) =>  (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm md:text-base pb-3 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
  )
}

export default ArtistTabs