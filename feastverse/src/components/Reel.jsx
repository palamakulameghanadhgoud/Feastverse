import { useRef, useEffect } from 'react'
import { useStore } from '../store.jsx'
import { findRestaurantById } from '../data'

export default function Reel({ reel, onOpenRestaurant }) {
  const videoRef = useRef(null)
  const { state, dispatch } = useStore()
  const baseId = reel.baseId || reel.id
  const isLiked = state.likes.has(baseId)
  const likeCount = (reel.likes || 0) + (isLiked ? 1 : 0)
  const rest = findRestaurantById(reel.restaurantId)
  const isFollowing = rest ? state.follows.has(rest.id) : false

  const HeartIcon = ({ filled }) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {filled ? (
        <path d="M12.001 21s-7.001-4.686-9.5-8.25C.76 10.403 2.063 6.5 5.75 6.5c2.108 0 3.292 1.2 4.251 2.5 0 0 1.25-2.5 4.249-2.5 3.688 0 4.992 3.903 3.249 6.25-2.5 3.564-9.498 8.25-9.498 8.25z" fill="#ff2c55"/>
      ) : (
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke="#fff" strokeWidth="1.6" fill="none"/>
      )}
    </svg>
  )

  const CommentIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12c0 3.866-4.03 7-9 7a10.6 10.6 0 01-2.6-.33L3 20.5l1.9-3.17C3.74 16.07 3 14.1 3 12 3 8.134 7.03 5 12 5s9 3.134 9 7z" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
    </svg>
  )

  const ShareIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13" stroke="#fff" strokeWidth="1.6"/>
      <path d="M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.6" fill="none"/>
    </svg>
  )

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    const rootEl = node.closest('.reels-container') || null
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const vid = entry.target
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            vid.play().catch(() => {})
          } else {
            vid.pause()
          }
        })
      },
      { root: rootEl, threshold: [0, 0.25, 0.5, 1] }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="reel">
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.videoUrl}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        onCanPlay={(e) => {
          const v = e.currentTarget
          if (v.paused) v.play().catch(() => {})
        }}
      />
      <div className="actions-rail">
        <button
          className="icon-button"
          aria-pressed={isLiked}
          onClick={() => dispatch({ type: 'TOGGLE_LIKE', payload: { reelId: baseId } })}
        >
          <HeartIcon filled={isLiked} />
          <span className="count">{likeCount}</span>
        </button>
        <button
          className="icon-button"
          onClick={() => {
            const text = `Check out this reel: ${reel.title}`
            if (navigator.clipboard?.writeText) {
              navigator.clipboard.writeText(text)
              alert('Link copied to clipboard!')
            }
          }}
        >
          <ShareIcon />
        </button>
      </div>
      <div className="reel-overlay">
        <div className="author-row">
          <div 
            className="avatar-sm" 
            style={{ 
              backgroundImage: reel.userPicture ? `url(${reel.userPicture})` : 'none',
              backgroundColor: reel.userPicture ? 'transparent' : '#555'
            }} 
          />
          <div className="author-name">
            {reel.userName || reel.userUsername || 'Unknown User'}
          </div>
          {rest && (
            <button
              className={`follow-pill${isFollowing ? ' active' : ''}`}
              onClick={() =>
                dispatch({ type: 'TOGGLE_FOLLOW', payload: { restaurantId: rest.id } })
              }
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
        <div className="reel-title">{reel.title}</div>
        {rest && (
          <button className="cta" onClick={() => onOpenRestaurant(reel.restaurantId)}>
            Order from {rest.name}
          </button>
        )}
      </div>
    </div>
  )
}


