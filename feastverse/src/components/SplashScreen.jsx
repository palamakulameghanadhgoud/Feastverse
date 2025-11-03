import { useState, useEffect, useRef } from 'react'

export default function SplashScreen({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      setIsPlaying(false)
      setTimeout(() => {
        onComplete()
      }, 300)
    }

    const handleCanPlay = () => {
      video.play().catch(err => {
        console.log('Autoplay prevented:', err)
        // If autoplay is blocked, show skip button and try to play
        setTimeout(() => {
          video.play().catch(() => {
            // If still fails, just complete after 2 seconds
            setTimeout(onComplete, 2000)
          })
        }, 100)
      })
    }

    video.addEventListener('ended', handleEnded)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onComplete])

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isPlaying ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <video
        ref={videoRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
        }}
        playsInline
        muted
        preload="auto"
      >
        <source src="/ew.mp4" type="video/mp4" />
      </video>

      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600',
          backdropFilter: 'blur(10px)',
        }}
      >
        Skip
      </button>
    </div>
  )
}

