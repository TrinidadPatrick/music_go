import useMoodStore from '@/Stores/MoodStore'
import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const MoodPlaylists = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const getMoodPlaylist = useMoodStore((s) => s.getMoodPlaylist)
    const moodPLaylists = useMoodStore((s) => s.moodPLaylists)
    const list = searchParams.get('list')
    const title = searchParams.get('title')
    
    if(!list){
        return navigate('/', {replace: true})
    }

    const handleSelect = (playlistId) => {
        navigate(`/public/playlist?list=${playlistId}`)
    }

    useEffect(() => {
        if(list){
            getMoodPlaylist(list)
        }
    },[list])

    return moodPLaylists && (
    <main className='flex-1 flex flex-col p-4 sm:p-10 max-w-[1920px]'>
        {
            title && 
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {title} Playlists
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                    Curated playlists for your {title?.toLowerCase()} mood
                    </p>
                </div>
            </div>
        }
        <section className='flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 overflow-auto gap-5 pb-20'>
            {
                moodPLaylists?.map((playlist, index) => {
                    return (
                       <div
                            key={index}
                            onClick={() => handleSelect(playlist.playlistId)}
                            className={`group cursor-pointer relative grow backdrop-blur-lg 
                            p-0 transition-all duration-500 rounded-t-lg
                            flex flex-col `}
                        >

                            <div className='overflow-hidden rounded-lg group-hover:brightness-75'>
                                <div
                                    className="group-hover:scale-105 aspect-square transition ease-in-out duration-300 flex items-center justify-center w-full bg-center bg-no-repeat bg-cover rounded-lg opacity-75"
                                    style={{
                                    backgroundImage: `url(${playlist?.thumbnails?.[1]?.url || playlist?.thumbnails?.[0]?.url})`,
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1 mt-2">
                                <h3 className="text-[0.7rem] sm:text-[0.75rem] md:text-[0.9rem] text-white line-clamp-2 text-start font-medium">
                                    {playlist?.title}
                                </h3>
                                <p className="text-[0.7rem] sm:text-xs md:text-[0.8rem] text-gray-400">
                                    {playlist?.description}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </section>
    </main>
    )
}

export default MoodPlaylists