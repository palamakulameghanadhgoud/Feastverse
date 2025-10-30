import { useEffect, useMemo, useRef, useState } from 'react'
import Reel from './Reel'
import { reels } from '../data'

export default function ReelsFeed({ onOpenRestaurant }) {
  const [pagesLoaded, setPagesLoaded] = useState(1)
  const sentinelRef = useRef(null)
  const loadingRef = useRef(false)

  const items = useMemo(() => {
    const out = []
    for (let p = 0; p < pagesLoaded; p += 1) {
      out.push(
        ...reels.map((r, idx) => ({
          ...r,
          baseId: r.id,
          // ensure unique keys per page
          id: `${r.id}-p${p}-${idx}`,
        }))
      )
    }
    return out
  }, [pagesLoaded])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingRef.current) {
            loadingRef.current = true
            setPagesLoaded((prev) => prev + 1)
            // small debounce to prevent rapid multi-fires
            setTimeout(() => {
              loadingRef.current = false
            }, 300)
          }
        })
      },
      { root: null, threshold: 0.1 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (reels.length === 0) {
    return (
      <div className="reels-container">
        <div className="empty-state">
          <div className="empty-icon">📹</div>
          <h3>No Reels Yet</h3>
          <p>Be the first to create amazing food content!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reels-container">
      {items.map((r) => (
        <Reel key={r.id} reel={r} onOpenRestaurant={onOpenRestaurant} />
      ))}
      <div ref={sentinelRef} style={{ height: 1 }} />
    </div>
  )
}


