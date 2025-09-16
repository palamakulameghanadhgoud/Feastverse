import { findRestaurantById } from '../data'
import { useStore } from '../store.jsx'

export default function RestaurantDetail({ restaurantId, onBack }) {
  const { state, dispatch } = useStore()
  const r = findRestaurantById(restaurantId)
  if (!r) return <div className="page">Restaurant not found</div>
  const isFollow = state.follows.has(r.id)
  const isSub = state.subscriptions.has(r.id)

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
    </div>
  )
}


