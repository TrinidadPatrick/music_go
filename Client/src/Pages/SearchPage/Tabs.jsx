import React from 'react'
import useSearchPageStore from '../../Stores/SearchPageStore';

const Tabs = () => {
    const activeTab = useSearchPageStore( state => state.activeTab)
    const setActiveTab = useSearchPageStore( state => state.setActiveTab)

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'songs', label: 'Songs' },
        { id: 'videos', label: 'videos' },
        { id: 'artists', label: 'Artists' },
        { id: 'albums', label: 'Albums' },
        { id: 'playlists', label: 'Playlists' }
    ];
    
  return (
    <div className="flex space-x-6 mb-8 border-b border-gray-700 w-full overflow-x-scroll min-h-[30px]  hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm pb-3 px-1 border-b-2 font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
  )
}

export default Tabs