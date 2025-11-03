import { useState, useEffect } from 'react'

export default function StoryViewer({ stories, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Auto-advance story after 5 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentIndex])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const currentStory = stories[currentIndex]

  return (
    <div 
      className="story-viewer-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          height: '80vh',
          backgroundColor: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Progress bars */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          gap: '4px',
          zIndex: 10,
        }}>
          {stories.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#fff',
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                  transition: 'width 0.1s linear',
                }}
              />
            </div>
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
          }}
        >
          ×
        </button>

        {/* Story header */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '15px',
          right: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 10,
        }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#555',
              backgroundImage: currentStory.user_picture ? `url(${currentStory.user_picture})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
            {currentStory.user_username || currentStory.user_name || 'User'}
          </div>
          <div style={{ color: '#ccc', fontSize: '12px', marginLeft: 'auto' }}>
            {getTimeAgo(currentStory.created_at)}
          </div>
        </div>

        {/* Story image */}
        <img
          src={currentStory.image_url}
          alt="Story"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Navigation areas */}
        <div
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '30%',
            cursor: 'pointer',
          }}
        />
        <div
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '70%',
            cursor: 'pointer',
          }}
        />
      </div>
    </div>
  )
}

function getTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

