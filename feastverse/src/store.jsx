import { createContext, useContext, useMemo, useReducer } from 'react'

const initialState = {
  currentRoute: 'feed',
  routeParams: {},
  cartItems: {},
  orders: [],
  address: '',
  likes: new Set(), // set of reel ids
  follows: new Set(), // restaurant ids
  subscriptions: new Set(), // restaurant ids
}

function reducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentRoute: action.payload.route,
        routeParams: action.payload.params || {},
      }
    case 'ADD_TO_CART': {
      const key = action.payload.menuItem.id
      const prev = state.cartItems[key]
      const nextQty = (prev?.qty || 0) + (action.payload.qty || 1)
      return {
        ...state,
        cartItems: {
          ...state.cartItems,
          [key]: {
            menuItem: action.payload.menuItem,
            qty: nextQty,
            restaurantId: action.payload.restaurantId,
          },
        },
      }
    }
    case 'REMOVE_FROM_CART': {
      const key = action.payload.menuItemId
      const copy = { ...state.cartItems }
      delete copy[key]
      return { ...state, cartItems: copy }
    }
    case 'UPDATE_QTY': {
      const key = action.payload.menuItemId
      const item = state.cartItems[key]
      if (!item) return state
      const qty = Math.max(0, action.payload.qty)
      if (qty === 0) {
        const copy = { ...state.cartItems }
        delete copy[key]
        return { ...state, cartItems: copy }
      }
      return {
        ...state,
        cartItems: { ...state.cartItems, [key]: { ...item, qty } },
      }
    }
    case 'SET_ADDRESS':
      return { ...state, address: action.payload }
    case 'PLACE_ORDER': {
      const newOrder = {
        id: `ord_${Date.now()}`,
        items: Object.values(state.cartItems),
        total: action.payload.total,
        etaMins: action.payload.etaMins,
        status: 'preparing',
        createdAt: Date.now(),
      }
      return { ...state, orders: [newOrder, ...state.orders], cartItems: {} }
    }
    case 'ADVANCE_ORDER_STATUS': {
      const next = state.orders.map((o) => {
        if (o.id !== action.payload.orderId) return o
        const order = { ...o }
        if (order.status === 'preparing') order.status = 'pickup'
        else if (order.status === 'pickup') order.status = 'on the way'
        else if (order.status === 'on the way') order.status = 'delivered'
        return order
      })
      return { ...state, orders: next }
    }
    case 'TOGGLE_LIKE': {
      const id = action.payload.reelId
      const next = new Set(state.likes)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...state, likes: next }
    }
    case 'TOGGLE_FOLLOW': {
      const id = action.payload.restaurantId
      const next = new Set(state.follows)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...state, follows: next }
    }
    case 'TOGGLE_SUBSCRIPTION': {
      const id = action.payload.restaurantId
      const next = new Set(state.subscriptions)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...state, subscriptions: next }
    }
    default:
      return state
  }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

// social helpers
export function toggleLike(dispatch, reelId) {
  dispatch({ type: 'TOGGLE_LIKE', payload: { reelId } })
}



