import React from 'react'
import {Music } from 'lucide-react';

const MusicList = ({mockResults, currentSong, playSong}) => {
  return (
    <div className="h-full"> {/* Added h-full */}
    <div className="bg-gray-800 rounded-lg p-6 flex-1 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4 flex-shrink-0">Available Songs</h2>
        
        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-2">
                {mockResults.map((song) => (
                    <div
                        key={song.id}
                        className={`flex items-center justify-between gap-5 p-4 rounded-lg cursor-pointer transition-colors ${
                            currentSong?.id === song.id 
                                ? 'bg-blue-900 border border-blue-600' 
                                : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => playSong(song)}
                    >
                        <div className='flex items-center gap-2'>
                        <div className={`${currentSong ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center`}>
                            <Music className={`${currentSong ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                        </div>
                        <div>
                            <h3 className="font-medium line-clamp-1">{song.title}</h3>
                            <p className="text-gray-400 text-sm">{song.artist}</p>
                        </div>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-400 text-sm">{song.duration}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
  )
}

export default MusicList