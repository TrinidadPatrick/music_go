import React from 'react';

const HomeLoader = () => {
  return (
    <div className="min-h-screen p-6 text-white ">
      {/* Today's hits section */}
      <div className="mb-8">
        <div className="w-32 h-8 mb-6 bg-gray-700 rounded animate-pulse"></div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group">
              <div className="relative mb-3 overflow-hidden bg-gray-700 rounded-lg aspect-square animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
              </div>
              <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick picks section */}
      <div>
        <div className="h-8 mb-6 bg-gray-700 rounded w-28 animate-pulse"></div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center p-3 space-x-4 rounded-lg bg-gray-900/50">
              {/* Track number */}
              <div className="flex-shrink-0 w-6 h-4 bg-gray-700 rounded animate-pulse"></div>
              
              {/* Album artwork */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded animate-pulse"></div>
              
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="w-3/4 h-4 mb-2 bg-gray-700 rounded animate-pulse"></div>
                <div className="w-1/2 h-3 bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Play count */}
              <div className="flex-shrink-0 w-16 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;