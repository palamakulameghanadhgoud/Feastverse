import { useState } from 'react'
import { findRestaurantById } from '../data'
import { useStore } from '../store.jsx'
import AddReview from './AddReview'

export default function RestaurantDetail({ restaurantId, onBack }) {
  const { state, dispatch } = useStore()
  const [showReviewModal, setShowReviewModal] = useState(false)
  const r = findRestaurantById(restaurantId)
  if (!r) return <div className="page">Restaurant not found</div>
  const isFollow = state.follows.has(r.id)
  const isSub = state.subscriptions.has(r.id)
  const restaurantReviews = state.reviews.filter((review) => review.restaurantId === restaurantId)

  const handleSubmitReview = (reviewData) => {
    dispatch({
      type: 'ADD_REVIEW',
      payload: { ...reviewData, id: `review_${Date.now()}` },
    })
  }

  return (
    <div className="page">
      <button className="link" onClick={onBack}>&larr; Back</button>
      <div className="restaurant-hero">
        <img className="restaurant-hero-img" src={r.image} alt={r.name} />
        <div className="restaurant-hero-info">
          <h2>{r.name}</h2>
          <div className="restaurant-meta">
            {r.cuisine} • {r.rating} ⭐ • {r.etaMins} mins •
            {r.deliveryFee === 0 ? ' Free delivery' : ` $${r.deliveryFee.toFixed(2)} fee`}
          </div>
          <div className="actions">
            <button
              className={`pill${isFollow ? ' active' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_FOLLOW', payload: { restaurantId: r.id } })}
            >
              {isFollow ? '✓ Following' : '➕ Follow'}
            </button>
            <button
              className={`pill${isSub ? ' active' : ''}`}
              onClick={() =>
                dispatch({ type: 'TOGGLE_SUBSCRIPTION', payload: { restaurantId: r.id } })
              }
            >
              {isSub ? '🔔 Subscribed' : '🔕 Subscribe'}
            </button>
          </div>
        </div>
      </div>
      <div className="menu">
        {r.menu.map((m) => (
          <div className="menu-item" key={m.id}>
            <div className="menu-name">{m.name}</div>
            <div className="menu-right">
              <div className="menu-price">${m.price.toFixed(2)}</div>
              <button
                className="cta"
                onClick={() =>
                  dispatch({ type: 'ADD_TO_CART', payload: { menuItem: m, restaurantId: r.id } })
                }
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h3>Reviews</h3>
          <button className="cta" onClick={() => setShowReviewModal(true)}>
            Write a Review
          </button>
        </div>
        
        {restaurantReviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {restaurantReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <img src={review.userAvatar || 'https://via.placeholder.com/40'} alt={review.userName} className="review-avatar" />
                  <div className="review-info">
                    <div className="review-user">{review.userName}</div>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="review-date">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="review-text">{review.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showReviewModal && (
        <AddReview
          restaurantId={restaurantId}
          restaurantName={r.name}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  )
}


