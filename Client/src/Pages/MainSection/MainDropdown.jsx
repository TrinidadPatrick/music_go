import { Library, BookMinus, Disc, Share } from 'lucide-react'

const MainDropDown = ({ track, onSave, onSelectPlaylist, isSaved }) => {  
    return (
      <div className="w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
        <ul className="p-2 space-y-2 text-sm text-white">
          {track?.videoId && (
            <li
              onClick={(e) => {
                e.stopPropagation()
                onSave(track)
              }}
              className={`hover:bg-gray-700 ${isSaved(track?.videoId) ? 'text-red-500' : ''} cursor-pointer p-2 rounded flex items-center gap-2`}
            >
              {isSaved(track?.videoId) ?
                <BookMinus size={16} className='text-red-500' /> :
                <Library size={16} className='text-gray-400' />}
              {isSaved(track?.videoId) ? 'Remove from Library' : 'Add to Library'}
            </li>
          )}
          <li
            onClick={(e) => {
              e.stopPropagation()
              onSelectPlaylist(track)
            }}
            className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700"
          >
            <Disc size={16} className='text-gray-400' />
            Add to Playlist
          </li>
          <li className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-700">
            <Share size={16} className='text-gray-400' />
            Share
          </li>
        </ul>
      </div>
    )
  }

  export default MainDropDown
  