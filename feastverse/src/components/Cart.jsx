import { useMemo } from 'react'
import { useStore } from '../store.jsx'
import { restaurants } from '../data'

export default function Cart({ onCheckout }) {
  const { state, dispatch } = useStore()
  const items = Object.values(state.cartItems)

  const { subtotal, deliveryFee, total, etaMins } = useMemo(() => {
    const sub = items.reduce((acc, it) => acc + it.menuItem.price * it.qty, 0)
    // Assume all items from same restaurant for simplicity
    const r = restaurants.find((r) => r.id === items[0]?.restaurantId)
    const fee = r ? r.deliveryFee : 0
    const eta = r ? r.etaMins : 20
    return { subtotal: sub, deliveryFee: fee, total: sub + fee, etaMins: eta }
  }, [items])

  if (items.length === 0) {
    return <div className="page">Your cart is empty.</div>
  }

  return (
    <div className="page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {items.map((it) => (
          <div key={it.menuItem.id} className="cart-item">
            <div className="cart-name">{it.menuItem.name}</div>
            <div className="cart-right">
              <div className="qty">
                <button
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QTY',
                      payload: { menuItemId: it.menuItem.id, qty: it.qty - 1 },
                    })
                  }
                >
                  -
                </button>
                <span>{it.qty}</span>
                <button
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_QTY',
                      payload: { menuItemId: it.menuItem.id, qty: it.qty + 1 },
                    })
                  }
                >
                  +
                </button>
              </div>
              <div className="price">${(it.menuItem.price * it.qty).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="row">
          <span>Delivery</span>
          <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
        </div>
        <div className="row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <button className="cta wide" onClick={() => onCheckout({ total, etaMins })}>
        Checkout
      </button>
    </div>
  )
}


