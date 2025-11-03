export default function BottomNav({ current, onNavigate, cartCount }) {
  const handleNavigate = (id) => {
    console.log('Navigating to:', id)
    onNavigate(id, {})
  }

  const Item = ({ id, label }) => (
    <button
      className={`bottom-nav-item${current === id ? ' active' : ''}`}
      onClick={() => handleNavigate(id)}
      title={label}
    >
      <span className="icon">
        {id === 'feed' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5l9-7 9 7V20a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V9.5z" stroke="#fff" strokeWidth="1.6"/></svg>
        )}
        {id === 'restaurants' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.6"/><path d="M20 20l-3-3" stroke="#fff" strokeWidth="1.6"/></svg>
        )}
        {id === 'orders' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" stroke="#fff" strokeWidth="1.6"/><rect x="7" y="6" width="10" height="5" stroke="#fff" strokeWidth="1.6"/></svg>
        )}
        {id === 'profile' && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="1.6"/><path d="M4 20c1.5-4 6-5 8-5s6.5 1 8 5" stroke="#fff" strokeWidth="1.6"/></svg>
        )}
      </span>
      {id === 'cart' && cartCount > 0 ? (
        <span className="badge">{cartCount}</span>
      ) : null}
    </button>
  )
  return (
    <nav className="bottom-nav">
      <Item id="feed" label="Home (Reels)" />
      <Item id="restaurants" label="Restaurants" />
      <Item id="orders" label="Orders" />
      <Item id="profile" label="Profile" />
    </nav>
  )
}


