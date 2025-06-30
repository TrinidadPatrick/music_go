import React, { useRef, useEffect, useCallback, useState } from 'react'
import YouTube from 'react-youtube'
import Player from './Player'
import useMusicPlayerStore from '../../Stores/MusicPlayerStore'
import { motion, AnimatePresence } from 'framer-motion'
import FullScreenPlayer from './FullScreenPlayer'
import { ChevronDown, FileText, MoreHorizontal, Video } from 'lucide-react'
import useScreenSize from '../../Auth/ScreenSizeProvider'
import { throttle, debounce } from 'lodash'

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

  const bufferingTimeoutRef = useRef(null)
  const {width} = useScreenSize(state => state.width)
  const currentTime = useMusicPlayerStore(state => state.currentTime)
  const isPlaying = useMusicPlayerStore(state => state.isPlaying)
  const isReady = useMusicPlayerStore(state => state.isReady)
  const setCurrentTime = useMusicPlayerStore(state => state.setCurrentTime)
  const playNextSong = useMusicPlayerStore(state => state.playNextSong)
  const setPlayerRef = useMusicPlayerStore(state => state.setPlayerRef)
  const fullScreen = useMusicPlayerStore(state => state.fullScreen)
  const toggleFullScreen = useMusicPlayerStore(state => state.toggleFullScreen)

  const [sidebarWidth, setSidebarWidth] = useState(70)
  const [activeTab, setActiveTab] = useState('video')

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
        if (bufferingTimeoutRef.current) {
          clearTimeout(bufferingTimeoutRef.current)
        }
        break
  
      case 2: // Paused
        setIsPlaying(false)
        break
  
      case 0: // Ended
        playNextSong()
        break
  
      case 3: // Buffering
        setIsLoading(true)
        bufferingTimeoutRef.current = setTimeout(() => {
          console.warn('Buffering too long, reloading video...')
          player.loadVideoById({
            videoId: currentSong.videoId,
            startSeconds: currentTime
          })
        }, 5000) // 5 sec fallback
        break
  
      default:
        break
    }
  }, [setIsPlaying, setIsLoading, playNextSong, currentSong, currentTime])

  const handleError = useCallback((event) => {
    console.error('YouTube player error:', event.data)
    setIsLoading(false)
    resetPlayer()
  }, [setIsLoading, resetPlayer])

  const handlePlay = useCallback(() => {
    setIsLoading(false)
  }, [setIsLoading])

  
  const togglePlayPause = useCallback(
    throttle(() => {
      if (!playerRef.current || !isReady) return;
  
      try {
        if (isPlaying) {
          playerRef.current.pauseVideo();
        } else {
          playerRef.current.playVideo();
        }
      } catch (error) {
        console.error('Error toggling play/pause:', error);
      }
    }, 300, { trailing: false }), // No trailing call — instant toggle
    [isPlaying, isReady]
  );

  const handleVolumeChange = useCallback((newVolume) => {
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume)
      setVolume(newVolume)
    }
  }, [setVolume])

  const handleSeek = useCallback(
    throttle((time) => {
      if (playerRef.current && isReady) {
        playerRef.current.seekTo(time, true)
        setCurrentTime(time)
      }
    }, 500),
    [isReady, setCurrentTime]
  )

  const YoutubePlayer = useCallback(()=>{
    const YOUTUBE_OPTS = {
      height: width <= 450 ? '450' : '500',
      width: width <= 450 ? '350' : '500',
      volume: 0,
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
    return (
      <YouTube
          videoId={currentSong.videoId}
          opts={YOUTUBE_OPTS}
          onReady={handleReady}
          onStateChange={handleStateChange}
          onError={handleError}
          onPlay={handlePlay}
        />
    )
  }, [currentSong, width])

  const Switcher = useCallback(()=>{
    return (
      <div className="flex items-center gap-1 p-1 mb-8 rounded-full bg-white/10 backdrop-blur-md">
        <button 
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
            activeTab === 'video' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Video size={16} />
          Video
        </button>
        <button 
          onClick={() => setActiveTab('lyrics')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
            activeTab === 'lyrics' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileText size={16} />
          Lyrics
        </button>
      </div>
  )
  }, [currentSong, activeTab])

  useEffect(()=>{
    const el = document.getElementById('sidebar')

    if(!el) return;

    setSidebarWidth(el.offsetWidth)

    const observer = new ResizeObserver((entries)=>{
      for (let entry of entries){
        setSidebarWidth(entry.contentRect.width)
      }
    })

    observer.observe(el)

    return ()=> observer.disconnect()

  }, [])

  // Time update effect
  useEffect(() => {
    const interval = 250 // ms
    
    if (playerRef.current && isPlaying && isReady) {
      timeUpdateIntervalRef.current = setInterval(() => {
        try {
          const time = playerRef.current.getCurrentTime()
  
          if (typeof time === 'number' && !isNaN(time)) {
            const diff = Math.abs(time - lastTimeRef.current)
  
            if (diff >= 0.01) {
              setCurrentTime(time)
              lastTimeRef.current = time
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
  }, [isPlaying, isReady])

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



  return  (
    <div className="bottom-0 right-0 flex w-full overflow-hidden bg-gray-950">
  <div className="flex flex-col w-full h-full">

    {/* Full Screen Player */}
    <motion.div
      initial={{ height: '0%' }}
      animate={{ height: fullScreen ? '100%' : 0 }}
      exit={{ height: '0%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ position: 'absolute', width: width <= 1023 ? '100%' : `calc(100% - ${sidebarWidth}px)` }}
      className="bottom-0 right-0 z-50 flex overflow-hidden"
    >
      <div className="flex flex-col items-center justify-start w-full bg-gray-950 z-90">

        {/* Header */}
        <div className="flex justify-between w-full p-5">
          <button onClick={toggleFullScreen}>
            <ChevronDown size={30} className="text-gray-200 hover:text-gray-300" />
          </button>

          <button className="text-3xl font-bold text-transparent cursor-pointer bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            MusicHub
          </button>

          <button>
            <MoreHorizontal size={30} className="text-gray-200 hover:text-gray-300" />
          </button>
        </div>

        {/* Switcher */}
        <div className="absolute translate-y-25 z-90">
          <Switcher />
        </div>

        {/* YouTube Player */}
        <div className='relative'>
          <div style={{width : 'calc(100% + 2px)'}} className='absolute h-[120px] bg-gray-950  top-0' />
            <YoutubePlayer />
          <div style={{width : 'calc(100% + 2px)'}} className='absolute h-[120px] bg-gray-950  bottom-0' />
        </div>

        {/* FullScreenPlayer */}
        {fullScreen && (
          <FullScreenPlayer
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
        )}

      </div>
    </motion.div>

    {/* Original Player */}
    {!fullScreen && (
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
    )}
    
  </div>
</div>

  )
}

export default MusicPlayer