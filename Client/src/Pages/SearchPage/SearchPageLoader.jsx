import React from 'react';

const SearchPageLoader = () => {
  return (
    <div className="min-h-screen p-6 text-white ">
      {/* Videos Section */}
      <div className="mb-12">
        <div className="w-20 h-8 mb-6 bg-gray-700 rounded animate-pulse"></div>
        
        {/* Video Grid - Horizontal Scroll Layout */}
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex-shrink-0 space-y-3 w-72">
              {/* Video Thumbnail */}
              <div className="relative overflow-hidden bg-gray-700 rounded-lg aspect-video animate-pulse">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-500/20 to-transparent animate-pulse"></div>
              </div>
              
              {/* Video Title */}
              <div className="space-y-2">
                <div className="w-full h-5 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-3/4 h-5 bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Channel Name */}
              <div className="w-24 h-4 bg-gray-700 rounded animate-pulse"></div>
              
              {/* Video Duration and Views */}
              <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Songs Section */}
      <div>
        <div className="w-16 h-8 mb-6 bg-gray-700 rounded animate-pulse"></div>
        
        {/* Songs List */}
        <div className="space-y-1">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-center px-1 py-2 rounded hover:bg-secondary/20/50 group">
              {/* Track Number */}
              <div className="w-8 text-center">
                <div className="w-4 h-5 mx-auto bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Album Art */}
              <div className="flex-shrink-0 w-12 h-12 ml-4 bg-gray-700 rounded animate-pulse"></div>
              
              {/* Song Info */}
              <div className="flex-1 ml-4 space-y-1">
                <div className="w-24 h-5 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Song Title (Center-Right) */}
              <div className="flex-1 text-center">
                <div className="w-32 h-5 mx-auto bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Duration */}
              <div className="w-16 text-right">
                <div className="w-10 h-4 ml-auto bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPageLoader;