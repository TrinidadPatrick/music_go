import React from 'react'

const SearchPageLoader = () => {
  return (
    <div className='w-full h-full'>
        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <div key={index} className="flex items-center py-3 px-2 hover:bg-gray-800 rounded-md group">
          {/* Track number */}
          <div className="w-6 mr-4 flex justify-center">
            <div className="w-3 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          {/* Album cover */}
          <div className="w-12 h-12 bg-gray-700 rounded mr-4 animate-pulse flex-shrink-0"></div>
          
          {/* Song info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              {/* Song title */}
              <div className="h-4 bg-gray-700 rounded animate-pulse mb-1" 
                   style={{ width: `${Math.random() * 40 + 30}%` }}></div>
              {/* Artist name */}
              <div className="h-3 bg-gray-600 rounded animate-pulse" 
                   style={{ width: `${Math.random() * 30 + 20}%` }}></div>
            </div>
          </div>
          
          {/* Album/playlist info (middle section) */}
          <div className="flex-1 min-w-0 mx-8 hidden md:block">
            <div className="h-3 bg-gray-600 rounded animate-pulse" 
                 style={{ width: `${Math.random() * 60 + 40}%` }}></div>
          </div>
          
          {/* Duration */}
          <div className="w-12 text-right mr-4">
            <div className="h-3 bg-gray-600 rounded animate-pulse ml-auto" 
                 style={{ width: '24px' }}></div>
          </div>
          
          {/* More options button */}
          <div className="w-6 h-6 bg-gray-700 rounded animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  )
}

export default SearchPageLoader