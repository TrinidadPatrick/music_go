import React, { memo, useCallback, useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Music, Loader, Repeat1, Video, FileText, Share, Share2, Heart, Clock, Headset, Calendar } from 'lucide-react'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import useLibraryStore from '@/Stores/AuthMusicStores/LibraryStore'
import useSongDetails from '@/Stores/SongDetailStore'
import { throttle } from 'lodash'
import { Slider } from '@/Components/ui/slider.jsx'

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatViews = (viewString) => {
  const views = Number(viewString)
  if (views >= 1e9) {
    return `${(views / 1e9).toFixed(1)}B`
  } else if (views >= 1e6) {
    return `${(views / 1e6).toFixed(1)}M`
  } else if (views >= 1e3) {
    return `${(views / 1e3).toFixed(1)}k`
  } else {
    return `${views}`
  }
}

const ProgressSlider = memo(({ currentTime, duration, onSeek }) => {
  const [localTime, setLocalTime] = useState(currentTime);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime);
    }
  }, [currentTime, isDragging]);

  const handleValueChange = (value) => {
    setIsDragging(true);
    setLocalTime(value[0]);
  };

  const handleValueCommit = (value) => {
    setIsDragging(false);
    onSeek(value[0]);
  };

  return (
    <div className="flex-row items-center w-[95%] md:w-[70%] gap-2 flex">
      <span className="text-sm text-gray-500 min-w-[40px] text-right">
        {formatTime(localTime)}
      </span>
      <Slider
        value={[localTime || 0]}
        max={duration || 0}
        step={1}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        className="flex-1"
      />
      <span className="text-sm text-gray-500 min-w-[40px]">
        {formatTime(duration)}
      </span>
    </div>
  )
})

const VolumeControl = memo(({ volume, onVolumeChange }) => {
  const handleVolumeChange = (value) => {
    const newVolume = value[0]
    onVolumeChange(newVolume)
  }

  return (
    <div className="group flex items-center gap-2">
      <Volume2 className="w-4 h-4 text-gray-400" />
      <div className="group-hover:opacity-100 group-hover:w-24 transition-all duration-200 opacity-0 items-center w-0">
        <Slider
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
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
          <Loader className="text-gray-900" />
        </div>
      )
    }

    if (isReady && isPlaying) {
      return <Pause className="w-6 h-6 text-gray-900 sm:w-7 sm:h-7" />
    }

    if (isReady && !isPlaying) {
      return <Play className="text-gray-900 ml-0.5 w-6 h-6 sm:w-7 sm:h-7" />
    }

    return <Play className="text-gray-900 ml-0.5 w-6 h-6 sm:w-7 sm:h-7" />
  }

  return (
    <button
      onClick={onToggle}
      disabled={!isReady}
      className="p-3 font-medium transition-all duration-200 transform bg-white/90 rounded-full shadow-lg cursor-pointer hover:bg-gray-white/80 disabled:bg-white/50 disabled:cursor-not-allowed hover:scale-105 disabled:transform-none"
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
  const saveToLibrary = useLibraryStore(state => state.saveToLibrary)
  const library = useLibraryStore(state => state.library)
  const getSongDetails = useSongDetails(state => state.getSongDetails)
  const playNextSong = useMusicPlayerStore(state => state.playNextSong)
  const playPrevSong = useMusicPlayerStore(state => state.playPrevSong)
  const artistNames = Array.isArray(currentSong?.artists) ? currentSong?.artists?.map(artist => artist.name).join(', ') : currentSong?.artists || 'Unknown Artist'
  const publishDate = songDetails && new Date(songDetails?.microformat?.microformatDataRenderer?.publishDate).toLocaleDateString('EN-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-')

  const handleSave = async () => {
    const songDetail = await getSongDetails(songDetails.videoDetails.videoId);
    const data = songDetail.videoDetails;
    const songData = {
      videoId: data.videoId,
      title: data.title,
      artists: [{ name: data.author }],
      album: null,
      duration_seconds: data.lengthSeconds,
      thumbnails: data.thumbnail ? data.thumbnail.thumbnails : null,
    };
    saveToLibrary(songData);
  }

  const handleNextSong = useCallback(
    throttle(() => {
      playNextSong()
    }, 3000, { trailing: false }),
    []
  )

  const handlePrevSong = useCallback(
    throttle(() => {
      playPrevSong()
    }, 3000, { trailing: false }),
    []
  )

  const isSaved = library?.library_songs?.some((song) => song?.videoId === songDetails?.videoDetails?.videoId)

  return (
    <div className="flex flex-col items-center justify-between w-full p-3 gap-9 -translate-y-27 sm:gap-5 bg-card">
      {/* Music Info */}
      <div className="flex items-center flex-1">
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <h3 className="text-lg font-semibold text-center text-white sm:text-xl line-clamp-1">
            {currentSong.title}
          </h3>
          <p className="text-sm text-center text-gray-400 truncate sm:text-base">
            {artistNames}
          </p>
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

            {/* Shuffle button */}
            <button onClick={() => toggleShuffle()} className={` ${shuffleOn && 'bg-gray-700/50'} p-2 rounded-full  transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}>
              {
                shuffleOn ?
                  <Shuffle className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5 " />
                  : <Shuffle className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
              }
            </button>

            {/* Previous button */}
            <button onClick={handlePrevSong} className="p-2 text-gray-200 transition-all duration-200 rounded-full hover:text-white hover:bg-gray-700/50">
              <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Play button */}
            <PlayButton
              isReady={isReady}
              isPlaying={isPlaying}
              isLoading={isLoading}
              onToggle={onTogglePlayPause}
            />

            {/* Next button */}
            <button onClick={handleNextSong} className="p-2 text-gray-200 transition-all duration-200 rounded-full hover:text-white hover:bg-gray-700/50">
              <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Repeat button */}
            <button onClick={() => { setRepeatSetting(repeatSetting === 'off' ? 'one' : repeatSetting === 'one' ? 'all' : 'off') }}
              className={`${repeatSetting === 'all' && 'bg-gray-700/50'} p-2  rounded-full transition-all duration-200 hover:bg-gray-700/50 cursor-pointer`}
            >
              {
                repeatSetting === 'off' || repeatSetting === 'all' ?
                  <Repeat className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
                  : repeatSetting === 'one' &&
                  <Repeat1 className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  )
})

FullScreenPlayer.displayName = 'Player'
ProgressSlider.displayName = 'ProgressSlider'
VolumeControl.displayName = 'VolumeControl'
PlayButton.displayName = 'PlayButton'

export default FullScreenPlayer