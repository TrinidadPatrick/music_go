import React, { memo, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Loader, Repeat1, Repeat2, ShuffleIcon, ChevronUp, ChevronDown } from 'lucide-react'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { throttle } from 'lodash'

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
    <div className="flex-row items-center hidden w-full gap-2 md:flex">
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
      <div className="flex items-center w-20">
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
      className="p-3 font-medium transition-all duration-200 transform bg-blue-600 rounded-full shadow-lg cursor-pointer hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed hover:scale-105 disabled:transform-none"
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
  const toggleFullScreen = useMusicPlayerStore(state => state.toggleFullScreen)
  const setFullScreen = useMusicPlayerStore(state => state.setFullScreen)
  const fullScreen = useMusicPlayerStore(state => state.fullScreen)
  const playNextSong = useMusicPlayerStore(state => state.playNextSong)
  const playPrevSong = useMusicPlayerStore(state => state.playPrevSong)
  const artistNames = Array.isArray(currentSong?.artists) ? currentSong?.artists?.map(artist => artist.name).join(', ') : currentSong?.artists || 'Unknown Artist'
  const thumbnailUrl = currentSong?.thumbnails?.[0]?.url

  const handleNextSong = useCallback(
    throttle(()=>{
      playNextSong()
    }, 3000, {trailing : false}),
    []
  )

  const handlePrevSong = useCallback(
    throttle(()=>{
      playPrevSong()
    }, 3000, {trailing : false}),
    []
  )

  return (
    <div className="relative flex justify-between w-full gap-3 p-3 glass-panel z-90">
      {/* Music Info */}
      <div className="flex items-center flex-1 gap-2">
      <button onClick={toggleFullScreen} className='p-1.5 rounded-full hover:bg-gray-100/10'>
          {
            fullScreen ?
            <ChevronDown size={30} className="text-gray-200 hover:text-gray-300 " />
            :
            <ChevronUp size={30} className="text-gray-200 hover:text-gray-300 " />
          }
        </button>
        <div className="flex items-center justify-center h-10 overflow-hidden rounded aspect-square bg-gradient-to-br from-purple-500 to-pink-500">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={currentSong.title}
              className="object-cover w-full h-full" 
            />
          ) : (
            <Music className="text-white" />
          )}
        </div>
        <div className="flex flex-col flex-1 min-w-0 ">
          <h3 className="text-base font-medium text-white md:text-lg line-clamp-1">
            {currentSong.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {artistNames}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col-reverse sm:flex-1 sm:min-w-sm">

        {/* Progress Slider */}
        <ProgressSlider
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
        />

        <div className="flex items-center justify-end gap-2 xs:justify-center">
          {/* Shuffle button */}
          <button onClick={()=>toggleShuffle()} className={` ${shuffleOn && 'bg-gray-700/50'} p-2 rounded-full hidden sm:block transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}>
            {
              shuffleOn ?
              <Shuffle className="w-4 h-4 text-gray-400 " /> 
              : <Shuffle className="w-4 h-4 text-gray-400" />
            }
          </button>
          
          {/* Previous button */}
          <button onClick={handlePrevSong} className="hidden p-2 text-gray-400 transition-all duration-200 rounded-full xs:block hover:text-white hover:bg-gray-700/50">
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play button */}
          <PlayButton
            isReady={isReady}
            isPlaying={isPlaying}
            isLoading={isLoading}
            onToggle={onTogglePlayPause}
          />

          {/* Next button */}
          <button onClick={handleNextSong} className="hidden p-2 text-gray-400 transition-all duration-200 rounded-full xs:block hover:text-white hover:bg-gray-700/50">
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Repeat button */}
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
      <div className="items-center justify-end flex-1 hidden gap-3 md:flex">
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