import React, { memo } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Loader, Repeat1, Repeat2, ShuffleIcon } from 'lucide-react'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const ProgressSlider = memo(({ currentTime, duration, onSeek }) => {
  const handleChange = (e) => {
    const newTime = parseFloat(e.target.value)
    onSeek(newTime)
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className=" flex-row gap-2 w-full items-center hidden md:flex">
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
      <Volume2 className="w-4 h-4 text-gray-400" />
      <div className="w-20 flex items-center">
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
      return <Pause className="text-white" />
    }
    
    if (isReady && !isPlaying) {
      return <Play className="text-white ml-0.5" />
    }
    
    return <Play className="text-white ml-0.5" />
  }

  return (
    <button
      onClick={onToggle}
      disabled={!isReady}
      className="p-3 bg-blue-600 cursor-pointer hover:bg-blue-500 disabled:bg-gray-600 
        disabled:cursor-not-allowed rounded-full font-medium transition-all duration-200 
        transform hover:scale-105 shadow-lg disabled:transform-none"
    >
      {renderIcon()}
    </button>
  )
})

const Player = memo(({
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
  const artistNames = currentSong?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'
  const thumbnailUrl = currentSong?.thumbnails?.[0]?.url

  return (
    <div className="bg-gray-950 p-3 flex justify-between gap-3 w-full">
      {/* Music Info */}
      <div className="flex gap-2 items-center flex-1">
        <div className="h-10 aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded overflow-hidden flex items-center justify-center">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={currentSong.title}
              className="w-full h-full object-cover" 
            />
          ) : (
            <Music className="text-white" />
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1 ">
          <h3 className="text-base md:text-lg line-clamp-1 text-white font-medium">
            {currentSong.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">
            {artistNames}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col-reverse sm:flex-1 sm:min-w-sm">
        <ProgressSlider
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />

        <div className="flex items-center justify-end xs:justify-center gap-2">
          <button onClick={()=>toggleShuffle()} className={` ${shuffleOn && 'bg-gray-700/50'} p-2 rounded-full hidden sm:block transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}>
            {
              shuffleOn ?
              <Shuffle className="w-4 h-4 text-gray-400 " /> 
              : <Shuffle className="w-4 h-4 text-gray-400" />
            }
          </button>

          <button className="p-2 hidden xs:block text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200">
            <SkipBack className="w-5 h-5" />
          </button>

          <PlayButton
            isReady={isReady}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onToggle={onTogglePlayPause}
          />

          <button className="p-2 hidden xs:block text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200">
            <SkipForward className="w-5 h-5" />
          </button>

          <button onClick={()=>{setRepeatSetting(repeatSetting === 'off' ? 'one' : repeatSetting === 'one' ? 'all' : 'off')}} 
          className={`${repeatSetting === 'all' && 'bg-gray-700/50'} p-2 hidden sm:block rounded-full transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}
          >
            {
              repeatSetting === 'off' || repeatSetting === 'all' ?
              <Repeat className="w-4 h-4 text-gray-400" /> 
              : repeatSetting === 'one' &&
              <Repeat1 className="w-4 h-4 text-gray-400" /> 
            }
          </button>
        </div>
      </div>

      {/* Volume Control */}
      <div className=" items-center hidden md:flex justify-end flex-1">
        <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
      </div>
    </div>
  )
})

Player.displayName = 'Player'
ProgressSlider.displayName = 'ProgressSlider'
VolumeControl.displayName = 'VolumeControl'
PlayButton.displayName = 'PlayButton'

export default Player