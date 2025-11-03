import { useEffect, useState } from 'react'
import Reel from './Reel'
import UploadReel from './UploadReel'
import { useAuth } from './AuthProvider'
import apiClient from '../api/client'

export default function ReelsFeed({ onOpenRestaurant }) {
  const [reels, setReels] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    loadReels()
  }, [])

  const loadReels = async () => {
    try {
      const data = await apiClient.getReels()
      setReels(
        data.map((r) => ({
          id: r.id,
          title: r.title,
          videoUrl: r.video_url,
          thumbnailUrl: r.thumbnail_url,
          restaurantId: r.restaurant_id,
          likes: r.likes || 0,
          userName: r.user_name,
          userUsername: r.user_username,
          userPicture: r.user_picture,
        }))
      )
    } catch (e) {
      console.error('Failed to load reels', e)
    }
  }

  const handleUploadSuccess = () => {
    // Reload reels after successful upload
    loadReels()
  }

  const handleUploadClick = () => {
    if (!user) {
      alert('Please login to upload reels')
      return
    }
    setShowUploadModal(true)
  }

  if (reels.length === 0) {
    return (
      <div className="reels-container">
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No Reels Yet</h3>
          <p>Be the first to create amazing food content!</p>
          <button 
            onClick={handleUploadClick}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#ff2c55',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Upload Your First Reel
          </button>
        </div>
        {showUploadModal && (
          <UploadReel 
            onClose={() => setShowUploadModal(false)} 
            onSuccess={handleUploadSuccess}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={handleUploadClick}
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#ff2c55',
          color: '#fff',
          border: 'none',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Upload Reel"
      >
        +
      </button>
      
      <div className="reels-container">
        {reels.map((r) => (
          <Reel key={r.id} reel={r} onOpenRestaurant={onOpenRestaurant} />
        ))}
      </div>
      
      {showUploadModal && (
        <UploadReel 
          onClose={() => setShowUploadModal(false)} 
          onSuccess={handleUploadSuccess}
        />
      )}
    </>
  )
}


