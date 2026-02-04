import useMoodStore from '@/Stores/MoodStore'
import { TrendingUp } from 'lucide-react'
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
    <div className='bg-secondary/80 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-1 rounded-lg w-full h-full'>
      <div className='col-span-2 xs:col-span-3 sm:col-span-4 md:col-span-1 pt-3 px-4 flex gap-2 items-center'>
        <TrendingUp width={17} className='text-primary' />
        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">Moods</span>
      </div>
        {moodCategories.slice(0,10).map((mood, index) => (
              <button onClick={()=>handleClickCategory(mood.params, mood.title)} key={index} className="group flex items-center gap-3 py-1 px-4 rounded-lg transition-all duration-300 hover:bg-secondary cursor-pointer">
                <span className="text-base font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{mood.title}</span>
              </button>
        ))}
    </div>
  )
}

export default Moods