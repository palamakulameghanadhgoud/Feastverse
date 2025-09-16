import { useEffect } from 'react'
import { useStore } from '../store.jsx'

export default function Orders() {
  const { state, dispatch } = useStore()

  useEffect(() => {
    const timers = state.orders
      .filter((o) => o.status !== 'delivered')
      .map((o, idx) =>
        setTimeout(
          () => dispatch({ type: 'ADVANCE_ORDER_STATUS', payload: { orderId: o.id } }),
          3000 + idx * 2000
        )
      )
    return () => timers.forEach((t) => clearTimeout(t))
  }, [state.orders, dispatch])

  if (state.orders.length === 0) return <div className="page">No orders yet.</div>

  return (
    <div className="page orders">
      {state.orders.map((o) => (
        <div key={o.id} className="order-card">
          <div className="order-top">
            <div className="order-id">{o.id}</div>
            <div className={`status ${o.status.replace(/\s/g, '-')}`}>{o.status}</div>
          </div>
          <div className="order-items">
            {o.items.map((it) => (
              <div key={it.menuItem.id} className="order-item">
                <span>
                  {it.qty} × {it.menuItem.name}
                </span>
                <span>${(it.menuItem.price * it.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-bottom">
            <span>ETA: {o.etaMins} mins</span>
            <span>Total: ${o.total.toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}


