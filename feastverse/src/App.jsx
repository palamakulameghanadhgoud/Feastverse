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
import SplashScreen from './components/SplashScreen'
import { useMemo, useState, useEffect } from 'react'

function InnerApp() {
  const { state, dispatch } = useStore()
  const { user, isLoading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const cartCount = useMemo(
    () => Object.values(state.cartItems).reduce((a, it) => a + it.qty, 0),
    [state.cartItems]
  )

  const navigate = (route, params) =>
    dispatch({ type: 'NAVIGATE', payload: { route, params } })

  // Check if splash has been shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown === 'true') {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true')
    setShowSplash(false)
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

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
      <div className="feed" key="feed-page">
        <TopBar />
        <Stories />
        <ReelsFeed onOpenRestaurant={(id) => navigate('restaurant', { id })} />
      </div>
    )
  } else if (state.currentRoute === 'restaurants') {
    content = <Restaurants key="restaurants-page" onOpenDetail={(id) => navigate('restaurant', { id })} />
  } else if (state.currentRoute === 'restaurant') {
    const id = state.routeParams.id
    content = <RestaurantDetail key={`restaurant-${id}`} restaurantId={id} onBack={() => navigate('restaurants')} />
  } else if (state.currentRoute === 'cart') {
    content = (
      <Cart key="cart-page" onCheckout={({ total, etaMins }) => navigate('checkout', { total, etaMins })} />
    )
  } else if (state.currentRoute === 'checkout') {
    const { total, etaMins } = state.routeParams
    content = (
      <Checkout
        key="checkout-page"
        total={total}
        etaMins={etaMins}
        onOrderPlaced={() => navigate('orders')}
      />
    )
  } else if (state.currentRoute === 'orders') {
    content = <Orders key="orders-page" />
  } else if (state.currentRoute === 'profile') {
    content = <Profile key="profile-page" />
  }

  return (
    <div className="app-shell">
      <div className="content" key={state.currentRoute}>
        {content}
      </div>
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
