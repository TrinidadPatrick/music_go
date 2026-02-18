const ListLoader = () => {
    return (
      <div className="w-full min-h-screen text-white ">
        {/* Header Section */}
        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end">
            {/* Album Art Skeleton */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-700/70 animate-pulse"></div>
            </div>
            
            {/* Playlist Info Skeleton */}
            <div className="flex-1 min-w-0 space-y-3 md:space-y-4">
              {/* Title */}
              <div className="w-full h-8 max-w-xs rounded sm:h-10 md:h-12 bg-gray-600/70 animate-pulse"></div>
              
              {/* Subtitle Info */}
              <div className="space-y-2">
                <div className="w-40 h-3 rounded md:h-4 bg-gray-600/70 animate-pulse sm:w-48"></div>
              </div>
              
              {/* Control Buttons Skeleton */}
              <div className="flex items-center gap-4 pt-2 md:pt-4">
                <div className="w-12 h-12 bg-primary rounded-full md:w-14 md:h-14 animate-pulse"></div>
                <div className="w-8 h-8 rounded-full md:w-10 md:h-10 bg-gray-600/70 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Song List Section */}
        <div className="px-4 py-6 md:px-8">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 mb-4 text-sm text-gray-400 border-b border-gray-700">
            <div className="col-span-1">#</div>
            <div className="col-span-6 md:col-span-7">TITLE</div>
            <div className="hidden col-span-3 md:block">DATE ADDED</div>
            <div className="col-span-5 text-right md:col-span-1">
              <div className="w-4 h-4 ml-auto bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Song Rows Skeleton */}
          {[...Array(8)].map((_, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-secondary/20 group">
              {/* Track Number */}
              <div className="flex items-center col-span-1">
                <div className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              
              {/* Song Info */}
              <div className="flex items-center col-span-6 gap-3 md:col-span-7">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="w-full h-4 max-w-xs bg-gray-600 rounded animate-pulse"></div>
                  <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              
              {/* Date Added (Hidden on mobile) */}
              <div className="items-center hidden col-span-3 md:flex">
                <div className="w-24 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
              
              {/* Duration */}
              <div className="flex items-center justify-end col-span-5 md:col-span-1">
                <div className="w-8 h-4 bg-gray-600 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  export default ListLoader