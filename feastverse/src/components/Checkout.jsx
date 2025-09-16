import { useState } from 'react'
import { useStore } from '../store.jsx'

export default function Checkout({ total, etaMins, onOrderPlaced }) {
  const { state, dispatch } = useStore()
  const [address, setAddress] = useState(state.address)

  return (
    <div className="page">
      <h2>Checkout</h2>
      <label className="field">
        <span>Delivery Address</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Main St, City, ZIP"
          rows={3}
        />
      </label>
      <label className="field">
        <span>Card Number</span>
        <input placeholder="4242 4242 4242 4242" />
      </label>
      <div className="summary">
        <div>ETA: {etaMins} mins</div>
        <div>Total: ${total.toFixed(2)}</div>
      </div>
      <button
        className="cta wide"
        onClick={() => {
          dispatch({ type: 'SET_ADDRESS', payload: address })
          dispatch({ type: 'PLACE_ORDER', payload: { total, etaMins } })
          onOrderPlaced()
        }}
      >
        Pay & Place Order
      </button>
    </div>
  )
}


