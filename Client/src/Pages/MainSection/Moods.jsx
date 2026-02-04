import useMoodStore from '@/Stores/MoodStore'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Moods = () => {
    const navigate = useNavigate()
    const getMoodCategories = useMoodStore((s) => s.getMoodCategories)
    const moodCategories = useMoodStore((s) => s.moodCategories)

    useEffect(() => {
        getMoodCategories()
    }, [])

    const handleClickCategory = async (params, title) => {
        navigate(`mood-playlists?list=${params}&title=${title}`)
    }

    if(!moodCategories) return null

  return (
    <div className='bg-secondary/80 rounded-lg w-full h-full'>
        {moodCategories.slice(0,10).map((mood, index) => (
              <button onClick={()=>handleClickCategory(mood.params, mood.title)} key={index} className="group flex items-center gap-3 py-2 px-4 rounded-lg transition-all duration-300 hover:bg-secondary cursor-pointer">
                <span className="text-xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{mood.title}</span>
              </button>
        ))}
    </div>
  )
}

export default Moods