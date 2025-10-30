import './App.css'
import { StoreProvider, useStore } from './store.jsx'
import GoogleAuthProvider, { useAuth } from './components/AuthProvider'
import ReelsFeed from './components/ReelsFeed'
import Restaurants from './components/Restaurants'
import RestaurantDetail from './components/RestaurantDetail'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Orders from './components/Orders'
import BottomNav from './components/BottomNav'
import Profile from './components/Profile'
import TopBar from './components/TopBar'
import Stories from './components/Stories'
import Login from './components/Login'
import { useMemo } from 'react'

function InnerApp() {
  const { state, dispatch } = useStore()
  const { user, isLoading } = useAuth()
  const cartCount = useMemo(
    () => Object.values(state.cartItems).reduce((a, it) => a + it.qty, 0),
    [state.cartItems]
  )

  const navigate = (route, params) =>
    dispatch({ type: 'NAVIGATE', payload: { route, params } })

  // Show login page if not authenticated
  if (!isLoading && !user) {
    return <Login />
  }

  // Show loading state
  if (isLoading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
        Loading...
      </div>
    )
  }

  let content = null
  if (state.currentRoute === 'feed') {
    content = (
      <div className="feed">
        <TopBar />
        <Stories />
        <ReelsFeed onOpenRestaurant={(id) => navigate('restaurant', { id })} />
      </div>
    )
  } else if (state.currentRoute === 'restaurants') {
    content = <Restaurants onOpenDetail={(id) => navigate('restaurant', { id })} />
  } else if (state.currentRoute === 'restaurant') {
    const id = state.routeParams.id
    content = <RestaurantDetail restaurantId={id} onBack={() => navigate('restaurants')} />
  } else if (state.currentRoute === 'cart') {
    content = (
      <Cart onCheckout={({ total, etaMins }) => navigate('checkout', { total, etaMins })} />
    )
  } else if (state.currentRoute === 'checkout') {
    const { total, etaMins } = state.routeParams
    content = (
      <Checkout
        total={total}
        etaMins={etaMins}
        onOrderPlaced={() => navigate('orders')}
      />
    )
  } else if (state.currentRoute === 'orders') {
    content = <Orders />
  } else if (state.currentRoute === 'profile') {
    content = <Profile />
  }

  return (
    <div className="app-shell">
      <div className="content">{content}</div>
      <BottomNav current={state.currentRoute} onNavigate={navigate} cartCount={cartCount} />
    </div>
  )
}

export default function App() {
  return (
    <GoogleAuthProvider>
      <StoreProvider>
        <InnerApp />
      </StoreProvider>
    </GoogleAuthProvider>
  )
}
