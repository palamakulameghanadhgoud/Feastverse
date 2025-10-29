import { useState } from 'react'
import { useAuth } from './AuthProvider'

export default function AddReview({ restaurantId, restaurantName, onClose, onSubmit }) {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [photos, setPhotos] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) {
      alert('Please select a rating')
      return
    }
    onSubmit({
      restaurantId,
      rating,
      text: reviewText,
      photos,
      userName: user?.name || 'Anonymous',
      userAvatar: user?.picture || '',
      date: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review {restaurantName}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-section">
            <label>Your Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              rows="5"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

