import { restaurants } from '../data'

export default function Restaurants({ onOpen, onOpenDetail }) {
  if (restaurants.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No Restaurants Yet</h3>
          <p>Restaurants will appear here once they're added to the platform.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="restaurants-list">
        {restaurants.map((r) => (
          <button key={r.id} className="restaurant-card" onClick={() => onOpenDetail(r.id)}>
            <img className="restaurant-img" src={r.image} alt={r.name} loading="lazy" />
            <div className="restaurant-info">
              <div className="restaurant-name">{r.name}</div>
              <div className="restaurant-meta">
                {r.cuisine} • {r.rating} ⭐ • {r.etaMins} mins •
                {r.deliveryFee === 0 ? ' Free delivery' : ` $${r.deliveryFee.toFixed(2)} fee`}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}


