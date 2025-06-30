import React, { memo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Loader, Repeat1, Video, FileText, Share, Share2, Heart, Clock, Headset, Calendar } from 'lucide-react'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatViews = (viewString) => {
    const views = Number(viewString)
    if(views >= 1e9){
        return `${(views / 1e9).toFixed(1)}B`
    }else if (views >= 1e6){
        return `${(views / 1e6).toFixed(1)}M`
    }else if (views >= 1e3){
        return `${(views / 1e3).toFixed(1)}k`
    }else{
        return `${views}`
    }
}

const ProgressSlider = memo(({ currentTime, duration, onSeek }) => {
  const handleChange = (e) => {
    const newTime = parseFloat(e.target.value)
    onSeek(newTime)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex-row items-center w-[95%] md:w-[70%] gap-2 flex">
      <span className="text-sm text-gray-500 min-w-[40px] text-right">
        {formatTime(currentTime)}
      </span>
      <input
        className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-blue-500
          [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-lg
          [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110
          [&::-moz-range-thumb]:w-4
          [&::-moz-range-thumb]:h-4
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-blue-500
          [&::-moz-range-thumb]:cursor-pointer
          [&::-moz-range-thumb]:border-none"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progressPercentage}%, #374151 ${progressPercentage}%, #374151 100%)`
        }}
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime || 0}
        onChange={handleChange}
      />
      <span className="text-sm text-gray-500 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  )
})

const VolumeControl = memo(({ volume, onVolumeChange }) => {
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value)
    onVolumeChange(newVolume)
  }

  return (
    <div className="flex items-center gap-2">
      <Volume2 className="w-6 h-6 text-gray-400" />
      <div className="flex items-center w-23">
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:h-3
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:h-3
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-none"
          style={{
            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, #374151 ${volume}%, #374151 100%)`
          }}
        />
      </div>
    </div>
  )
})

const PlayButton = memo(({ isReady, isPlaying, isLoading, onToggle }) => {
  const renderIcon = () => {
    if (isLoading) {
      return (
        <div className="animate-spin">
          <Loader className="text-gray-200" />
        </div>
      )
    }
    
    if (isReady && isPlaying) {
      return <Pause className="w-8 h-8 text-white" />
    }
    
    if (isReady && !isPlaying) {
      return <Play className="text-white ml-0.5 w-8 h-8" />
    }
    
    return <Play className="text-white ml-0.5 w-8 h-8" />
  }

  return (
    <button
      onClick={onToggle}
      disabled={!isReady}
      className="p-3 font-medium transition-all duration-200 transform bg-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed hover:scale-105 disabled:transform-none"
    >
      {renderIcon()}
    </button>
  )
})


const FullScreenPlayer = memo(({
  currentSong,
  isReady,
  isPlaying,
  isLoading,
  currentTime,
  duration,
  volume,
  onTogglePlayPause,
  onVolumeChange,
  onSeek
}) => {
  if (!currentSong) return null

  const setRepeatSetting = useMusicPlayerStore(state => state.setRepeatSetting)
  const repeatSetting = useMusicPlayerStore(state => state.repeatSetting)
  const shuffleOn = useMusicPlayerStore(state => state.shuffleOn)
  const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)
  const songDetails = useMusicPlayerStore(state => state.songDetails)
  const artistNames = Array.isArray(currentSong?.artists) ? currentSong?.artists?.map(artist => artist.name).join(', ') : currentSong?.artists || 'Unknown Artist'
  const publishDate = songDetails && new Date(songDetails?.microformat?.microformatDataRenderer?.publishDate).toLocaleDateString('EN-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')

  return (
    <div className="flex flex-col items-center justify-between w-full p-3 gap-9 -translate-y-25 sm:gap-7 bg-gray-950">
      {/* Music Info */}
      <div className="flex items-center flex-1 gap-2">
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <h3 className="text-xl font-semibold text-center text-white md:text-2xl line-clamp-1">
            {currentSong.title}
          </h3>
          <p className="text-base text-center text-gray-400 truncate">
            {artistNames}
          </p>
          {/* Other info */}
          <div className='flex items-center gap-3 mt-5 sm:mt-2'>
            <div className='flex items-center gap-3 px-3 py-2 text-[0.7rem] sm:text-xs text-white bg-gray-800 border border-gray-700 rounded-full w-fit'>
                <Clock size={15} className='text-blue-400' />
                <span>{formatTime(songDetails?.videoDetails?.lengthSeconds)}</span>
            </div>
            <div className='flex items-center gap-3 px-3 py-2 text-[0.7rem] sm:text-xs text-white bg-gray-800 border border-gray-700 rounded-full w-fit'>
                <Headset size={15} className='text-green-400' />
                <span>{formatViews(songDetails?.videoDetails?.viewCount)}</span>
            </div>
            <div className='flex items-center gap-3 px-3 py-2 text-[0.7rem] sm:text-xs text-white bg-gray-800 border border-gray-700 rounded-full w-fit'>
                <Calendar size={15} className='text-orange-400' />
                <span>{publishDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Slider */}
      <ProgressSlider
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />

      {/* Controls */}
      <div className="flex flex-col-reverse sm:flex-1 sm:min-w-sm w-[95%] md:w-[50%] items-center gap-0">

        <div className='flex items-center justify-center'>

        {/* Main Controls */}
        <div className="flex items-center justify-between flex-1 gap-3 md:gap-5 md:justify-center">
          
          {/* Share Button */}
          <button className="p-2 text-gray-400 transition-colors rounded-full hover:text-white">
                <Share2  className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 hover:text-white" />
          </button>
            
          {/* Shuffle button */}
          <button onClick={()=>toggleShuffle()} className={` ${shuffleOn && 'bg-gray-700/50'} p-2 rounded-full  transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}>
            {
              shuffleOn ?
              <Shuffle className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6 " /> 
              : <Shuffle className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" />
            }
          </button>
          
          {/* Previous button */}
          <button className="p-2 text-gray-200 transition-all duration-200 rounded-full hover:text-white hover:bg-gray-700/50">
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Play button */}
          <PlayButton
            isReady={isReady}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onToggle={onTogglePlayPause}
          />

          {/* Next button */}
          <button className="p-2 text-gray-200 transition-all duration-200 rounded-full hover:text-white hover:bg-gray-700/50">
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Repeat button */}
          <button onClick={()=>{setRepeatSetting(repeatSetting === 'off' ? 'one' : repeatSetting === 'one' ? 'all' : 'off')}} 
          className={`${repeatSetting === 'all' && 'bg-gray-700/50'} p-2  rounded-full transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}
          >
            {
              repeatSetting === 'off' || repeatSetting === 'all' ?
              <Repeat className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" /> 
              : repeatSetting === 'one' &&
              <Repeat1 className="w-5 h-5 text-gray-400 sm:w-6 sm:h-6" /> 
            }
          </button>

          {/* Save */}
          <button className="p-2 text-white transition-colors rounded-full hover:text-white">
                <Heart size={25} className="text-gray-400 hover:text-white" />
          </button>
        </div>
         </div>

         {/* Volume Control */}
        {/* <div className="items-center justify-end flex-1 hidden gap-3 md:flex">
            <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
         </div> */}

      </div>
    </div>
  )
})

FullScreenPlayer.displayName = 'Player'
ProgressSlider.displayName = 'ProgressSlider'
VolumeControl.displayName = 'VolumeControl'
PlayButton.displayName = 'PlayButton'

export default FullScreenPlayer