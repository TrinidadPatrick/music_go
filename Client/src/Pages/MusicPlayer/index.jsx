import React, { useRef, useEffect, useCallback } from 'react'
import YouTube from 'react-youtube'
import Player from './Player'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'

const YOUTUBE_OPTS = {
  height: '1',
  width: '1',
  playerVars: {
    autoplay: 1,
    controls: 0,
    disablekb: 1,
    fs: 0,
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    iv_load_policy: 3,
    cc_load_policy: 0,
    start: 0,
    playsInline: 1
  },
}

const MusicPlayer = () => {
      
  const {
    currentSong,
    isLoading,
    duration,
    volume,
    setIsLoading,
    setIsPlaying,
    setDuration,
    setVolume,
    setIsReady,
    resetPlayer
  } = useMusicPlayerStore()

  const currentTime = useMusicPlayerStore(state => state.currentTime)
  const isPlaying = useMusicPlayerStore(state => state.isPlaying)
  const isReady = useMusicPlayerStore(state => state.isReady)
  const setCurrentTime = useMusicPlayerStore(state => state.setCurrentTime)
  const playNextSong = useMusicPlayerStore(state => state.playNextSong)
  const setPlayerRef = useMusicPlayerStore(state => state.setPlayerRef)
  
  const playerRef = useRef(null)
  const timeUpdateIntervalRef = useRef(null)
  const lastTimeRef = useRef(0)

  const handleReady = useCallback((event) => {
    const player = event.target
    playerRef.current = player

    setPlayerRef(playerRef)

    try {
      const videoDuration = player.getDuration()
      setDuration(videoDuration)
      setIsReady(true)
      player.playVideo()
    } catch (error) {
      console.error('Error in handleReady:', error)
    }
  }, [setDuration, setIsReady])

  const handleStateChange = useCallback((event) => {
    const player = event.target
    playerRef.current = player
    
    switch (event.data) {
      case 1: // Playing
        setIsPlaying(true)
        setIsLoading(false)
        break
      case 2: // Paused
        setIsPlaying(false)
        break
      case 0: // Ended
        playNextSong()
        break
      case 3: // Buffering
        setIsLoading(true)
        break
      default:
        break
    }
  }, [setIsPlaying, setIsLoading])

  const handleError = useCallback((event) => {
    console.error('YouTube player error:', event.data)
    setIsLoading(false)
    resetPlayer()
  }, [setIsLoading, resetPlayer])

  const handlePlay = useCallback(() => {
    setIsLoading(false)
  }, [setIsLoading])

  // Player control functions
  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !isReady) return
    
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error)
    }
  }, [isPlaying, isReady])

  const handleVolumeChange = useCallback((newVolume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
      setVolume(newVolume)
    }
  }, [setVolume])

  const handleSeek = useCallback((time) => {
    if (playerRef.current && isReady) {
      playerRef.current.seekTo(time, true)
      setCurrentTime(time)
    }
  }, [isReady, setCurrentTime])

  // Time update effect
  useEffect(() => {
    const interval = 10 // ms
    
    if (playerRef.current && isPlaying && isReady) {
      timeUpdateIntervalRef.current = setInterval(() => {
        try {
          const time = playerRef.current.getCurrentTime()
  
          if (typeof time === 'number' && !isNaN(time)) {
            const diff = Math.abs(time - lastTimeRef.current)
  
            if (diff >= 0.01) {
              setCurrentTime(time + 1)
              lastTimeRef.current = time + 1
            }
          }
        } catch (error) {
          console.error('Error getting current time:', error)
        }
      }, interval)
    } else {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
        timeUpdateIntervalRef.current = null
      }
    }
  }, [isPlaying, isReady]) // Remove currentTime and duration from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [])

  if (!currentSong) {
    return null
  }

  return (
    <div className="w-full bottom-0 right-0 flex h-fit overflow-hidden">
      <div className="h-full w-full flex flex-col">
        <Player
          currentSong={currentSong}
          isReady={isReady}
          isPlaying={isPlaying}
          isLoading={isLoading}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onTogglePlayPause={togglePlayPause}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
        />
      </div>
      
      {/* Hidden YouTube player */}
      <div className="absolute top-[-9999px] left-[-9999px] w-1 h-1 opacity-0 pointer-events-none">
        <YouTube
          videoId={currentSong.videoId}
          opts={YOUTUBE_OPTS}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
          onPlay={handlePlay}
        />
      </div>
    </div>
  )
}

export default MusicPlayer