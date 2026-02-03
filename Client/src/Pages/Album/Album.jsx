import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import usePublicPlaylistStore from '../../Stores/PublicPlaylistStore'
import { Heart, Plus, Play, Pause, MoreHorizontal, Clock, Download, Share, ShuffleIcon, Music, PlayIcon, Shuffle } from 'lucide-react';
import useFormatTimeStore from '../../Stores/FormatTimeStore';
import useMusicPlayerStore from '../../Stores/MusicPlayerStore';
import usePublicAlbumStore from '../../Stores/PublicAlbumStore';
import useScreenSize from '../../Auth/ScreenSizeProvider';
import useLibraryStore from '../../Stores/AuthMusicStores/LibraryStore';
import { Button } from '@/Components/ui/button.jsx';
import ListLoader from '@/Components/ListLoader';


const Album = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const list = params.get('list')
    const { formatTime } = useFormatTimeStore()
    const { getAlbum, album } = usePublicAlbumStore()
    const setCurrentSong = useMusicPlayerStore(state => state.setCurrentSong)
    const setIsLoading = useMusicPlayerStore(state => state.setIsLoading)
    const currentSong = useMusicPlayerStore(state => state.currentSong)
    const isPlaying = useMusicPlayerStore(state => state.isPlaying)
    const setIsPlaying = useMusicPlayerStore(state => state.setIsPlaying)
    const setSongList = useMusicPlayerStore(state => state.setSongList)
    const toggleShuffle = useMusicPlayerStore(state => state.toggleShuffle)
    const library = useLibraryStore(state => state.library)
    const saveToLibrary = useLibraryStore(state => state.saveToLibrary)

    const isSaved = (videoId) => {
        return library?.library_songs?.some((song) => song.videoId === videoId)
    }

    useEffect(() => {
        getAlbum(list, navigate)
    }, [])

    const playAll = () => {
        setSongList(album.tracks)
        setCurrentSong(album.tracks[0])
    }

    const playAllShuffled = () => {
        const index = Math.floor(Math.random() * album.tracks.length);
        setSongList(album.tracks)
        setCurrentSong(album.tracks[index])
        toggleShuffle()
    }

    const handlePlayPause = (track) => {
        if (currentSong?.videoId === track.videoId) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentSong(track);  // This already sets isLoading, currentTime, etc.
            setIsPlaying(true);
        }
    };

    const handleSelectSong = (track) => {
        setSongList(album.tracks)
        setCurrentSong(track)
        setIsPlaying(true)
        setIsLoading(true)
    }

    const handleSaveSong = (track) => {
        saveToLibrary(track)
    }

    if(!album) return <ListLoader />
    return (
        <div className="flex w-full h-full px-5 overflow-hidden text-white ">
            {/* Main Content */}
            <div className="flex-1 h-full overflow-auto">

                {/* Album Header */}
                <div className="relative mb-8 z-10">
                    <div className="absolute h-[250px] w-[90%] left-20 top-20 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-3xl blur-3xl -z-10" />

                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end p-6 md:p-8">
                        <div style={{
                            backgroundImage: `url(${album?.thumbnails ? (album?.thumbnails[1]?.url || album?.thumbnails[0]?.url) : ''})`
                        }} className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl group">
                            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
                                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                                </div>
                            </div>
                        </div>
                        {/* Album Info */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-primary font-medium">Album</span>
                                <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-1">
                                    {album.title}
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-lg">
                                    {/* {album.description} */}
                                </p>
                            </div>
                            {/* Stats */}
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-primary" />
                                <span>{album?.trackCount} songs</span>
                                <span className="mx-1">•</span>
                                <span>{album?.duration}</span>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-2">
                                <Button
                                    onClick={playAll}
                                    size="lg"
                                    className="rounded-full px-8 gap-2 shadow-glow bg-primary hover:bg-primary/90"
                                >
                                    <Play className="w-5 h-5 ml-0.5" />
                                    Play
                                </Button>
                                <Button
                                    onClick={playAllShuffled}
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full w-12 h-12 border-muted-foreground/30 hover:border-foreground hover:bg-secondary"
                                >
                                    <Shuffle className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Track List */}
                <div className="px-4 mt-10 sm:px-6 mb-20">
                    {/* Table Header – Hidden on mobile */}
                    <div className="hidden grid-cols-11 gap-4 px-4 py-2 mb-4 text-xs tracking-wide text-gray-400 uppercase border-b border-gray-800 sm:grid md:grid-cols-12">
                        <div className="col-span-1">#</div>
                        <div className="col-span-8">Title</div>
                        <div className="flex justify-center col-span-1">
                            <Clock size={16} />
                        </div>
                        <div className="flex justify-center col-span-1">
                        </div>
                    </div>

                    {/* Track Rows */}
                    <div className="space-y-1">
                        {album?.tracks?.map((track, index) => {
                            return (
                                <div
                                    onClick={() => handleSelectSong(track)}
                                    key={track.videoId}
                                    className={`${(currentSong?.videoId || "") === track?.videoId ? "bg-secondary/80" : ""
                                        } grid grid-cols-12 sm:grid-cols-11 md:grid-cols-12 gap-4 px-2 sm:px-4 py-3 rounded-lg hover:bg-secondary/20 transition-colors group cursor-pointer`}
                                >
                                    {/* Index - hidden on mobile */}
                                    <div className="items-center hidden col-span-1 sm:flex">
                                        <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePlayPause(track);
                                            }}
                                            className="hidden text-white group-hover:block hover:text-green-400"
                                        >
                                            {(currentSong?.videoId || "") === track.videoId && isPlaying ? (
                                                <Pause size={16} />
                                            ) : (
                                                <Play size={16} />
                                            )}
                                        </button>
                                    </div>

                                    {/* Title – always visible */}
                                    <div className="flex items-center min-w-0 col-span-10 space-x-3 sm:col-span-8 md:col-span-8">
                                        <div className="min-w-0">
                                            <p
                                                className={`font-medium ${(currentSong?.videoId || "") === track.videoId
                                                    ? "text-primary"
                                                    : "text-white"
                                                    } line-clamp-1 text-sm sm:text-base`}
                                            >
                                                {track.title}
                                            </p>

                                            {/* Artist – hidden on small screens */}
                                            <p className="text-xs text-gray-400 truncate sm:text-sm">
                                                {track.artists.map((artist) => artist.name).join(', ')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duration & Heart – only More shown on mobile */}
                                    <div className="flex items-center justify-center col-span-1 space-x-2 md:justify-center">
                                        <p className="hidden text-sm text-gray-400 sm:block">
                                            {formatTime(track.duration_seconds)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Album