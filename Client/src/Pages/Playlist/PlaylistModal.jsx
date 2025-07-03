import { Music, Image, X, Upload, Globe, Lock } from "lucide-react";
import { memo } from "react";
import Modal from 'react-modal';


const PlaylistModal = memo(({
    playlistName,
    setPlaylistName,
    description,
    setDescription,
    isPrivate,
    setIsPrivate,
    handleSubmit,
    setModalIsOpen,
    modalIsOpen,
    playlistId
})=>{

    const modalStyle = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          zIndex: '99999999',
          padding: '0',
          backgroundColor: 'transparent',
          border: 'none',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }
    };


    return (
      <Modal isOpen={modalIsOpen} style={modalStyle} onRequestClose={() => setModalIsOpen(false)}>
          <div className="bg-slate-800 rounded-2xl w-[350px] border border-slate-700 shadow-2xl transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
                  <Music size={16} className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">{!playlistId ? 'Create New Playlist' : 'Edit Playlist'}</h2>
              </div>
              <button 
                onClick={() => setModalIsOpen(false)}
                className="p-1 transition-colors rounded-lg cursor-pointer text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-3 space-y-6">
              {/* Cover Image Upload */}
              {/* <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {coverImage ? (
                    <img 
                      src={coverImage} 
                      alt="Playlist cover" 
                      className="object-cover w-24 h-24 border-2 rounded-xl border-slate-600"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed bg-slate-700 rounded-xl border-slate-600">
                      <Image size={24} className="text-slate-400" />
                    </div>
                  )}
                  <label className="absolute flex items-center justify-center w-8 h-8 transition-colors bg-blue-600 rounded-full cursor-pointer -bottom-2 -right-2 hover:bg-blue-700">
                    <Upload size={14} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                <p className="text-sm text-slate-400">Add a cover image</p>
              </div> */}

              {/* Playlist Name */}
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="w-full px-3 py-2 text-sm text-white transition-all border rounded-lg bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm text-white transition-all border rounded-lg resize-none bg-slate-700 border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Privacy Toggle */}
              <div className="flex items-center justify-between gap-5 p-4 border rounded-lg bg-slate-900 border-slate-600">
                <div className="flex items-center space-x-3">
                  {isPrivate ? (
                    <Lock size={20} className="text-slate-400" />
                  ) : (
                    <Globe size={20} className="text-slate-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isPrivate ? 'Private' : 'Public'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {isPrivate ? 'Only you can see this playlist' : 'Anyone can see this playlist'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${
                    isPrivate ? 'bg-blue-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPrivate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                  className="flex-1 px-3 py-2 text-sm font-medium transition-colors border rounded-lg text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!playlistName.trim()}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg whitespace-nowrap hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!playlistId ? 'Create Playlist' : 'Update Playlist'}
                </button>
              </div>
            </div>
          </div>
      </Modal>
    )})

    export default PlaylistModal