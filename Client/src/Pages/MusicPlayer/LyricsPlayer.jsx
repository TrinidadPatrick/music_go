import React, { memo, useEffect, useRef } from 'react'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { FileText } from 'lucide-react'

const LyricsPlayer = memo(({activeTab, currentTime}) => {
    const lyrics = useMusicPlayerStore(state => state.lyrics)
    const timeStamp = Number((currentTime * 1000).toFixed(0))


    
  return (
    <div className={`w-[95%] mx-auto sm:w-[500px] h-[450px] sm:h-[500px]  origin-center ${activeTab === 'video' && 'hidden'} flex flex-col justify-center bg-gray-950 `}>
        <div  className='w-full h-[220px] sm:h-[250px] bg-gray-100 rounded tracking-wide overflow-y-scroll p-2 hide-scrollbar'>
        {
            lyrics ? lyrics?.lyrics?.map((lyric, index) =>{
                const isHighlight = timeStamp >= lyric.start_time && timeStamp <= lyric.end_time
                return (
                    <p key={index} className={`${isHighlight ? ' font-bold scale-105' : 'text-gray-900'} text-sm text-center transition-transform duration-300`}>{lyric?.text}</p>
                )
            })
            :
            (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Lyrics not available
                </h3>
                <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                  We don't have the lyrics for this song yet. Check back later or try searching online.
                </p>
              </div>
            )
        }
        </div>
    </div>
  )
})

export default LyricsPlayer