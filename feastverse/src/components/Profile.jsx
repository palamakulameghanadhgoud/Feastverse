import { useState, useEffect } from 'react'
import { useStore } from '../store.jsx'
import { useAuth } from './AuthProvider'
import EditProfile from './EditProfile'
import apiClient from '../api/client'

export default function Profile() {
  const { state, dispatch } = useStore()
  const { user: authUser, logout, login } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const loadUserProfile = async () => {
    if (!authUser) {
      setIsLoading(false)
      return
    }

    try {
      const data = await apiClient.getCurrentUser()
      console.log('Loaded user profile:', data)
      setUserData(data)
      // Update auth context with latest data
      login({ ...authUser, ...data })
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUserProfile()
  }, []) // Only load once on mount

  // Reload when returning to profile
  useEffect(() => {
    if (authUser && !isLoading) {
      loadUserProfile()
    }
  }, [authUser?.id]) // Reload when user ID changes
  
  const handleLogout = () => {
    logout()
    dispatch({ type: 'NAVIGATE', payload: { route: 'feed', params: {} } })
  }

  const handleSaveProfile = async (profileData) => {
    // Reload profile after saving
    await loadUserProfile()
    dispatch({ type: 'UPDATE_PROFILE', payload: profileData })
  }

  const handleShareProfile = () => {
    if (!userData?.username) {
      alert('Please set a username first to share your profile!')
      setShowEditModal(true)
      return
    }

    const profileUrl = `${window.location.origin}/profile/${userData.username}`
    
    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(profileUrl).then(() => {
        alert(`Profile URL copied to clipboard!\n${profileUrl}`)
      }).catch(() => {
        // Fallback: show the URL
        prompt('Copy this URL to share your profile:', profileUrl)
      })
    } else {
      // Fallback for older browsers
      prompt('Copy this URL to share your profile:', profileUrl)
    }
  }
  
  // Use authenticated user data if available, otherwise show default
  const user = userData ? {
    username: userData.username || authUser?.email?.split('@')[0] || 'user',
    fullName: userData.name || authUser?.name || 'User',
    avatar: userData.picture || authUser?.picture || 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop',
    bio: userData.bio || '',
    website: userData.website || '',
    posts: state.reviews.length,
    followers: 0,
    following: state.follows.size,
  } : authUser ? {
    username: authUser.email?.split('@')[0] || 'user',
    fullName: authUser.name || 'User',
    avatar: authUser.picture || 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop',
    bio: '',
    website: '',
    posts: state.reviews.length,
    followers: 0,
    following: state.follows.size,
  } : {
    username: 'user',
    fullName: 'User',
    avatar: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop',
    bio: '',
    website: '',
    posts: 0,
    followers: 0,
    following: 0,
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#fff' }}>
          Loading profile...
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-top">
        <div className="username-row">
          <span className="lock">🔒</span>
          <span className="username">{user.username}</span>
          <span className="chev">▾</span>
          <div className="top-icons">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8M5.6 18.4l2.8-2.8m7.2-7.2 2.8-2.8" stroke="#fff" strokeWidth="1.6"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="3" width="6" height="4" rx="1" stroke="#fff" strokeWidth="1.6"/><path d="M4 7h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" stroke="#fff" strokeWidth="1.6"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="#fff" strokeWidth="1.6"/></svg>
          </div>
        </div>
        <div className="profile-header">
          <div className="avatar-lg" style={{ backgroundImage: `url(${user.avatar})` }} />
          <div className="profile-stats">
            <div className="stat"><div className="num">{user.posts}</div><div className="lbl">posts</div></div>
            <div className="stat"><div className="num">{user.followers}</div><div className="lbl">followers</div></div>
            <div className="stat"><div className="num">{user.following}</div><div className="lbl">following</div></div>
          </div>
        </div>
        <div className="profile-names">{user.fullName}</div>
        {user.bio && <div className="profile-bio">{user.bio}</div>}
        {user.website && (
          <div className="profile-bio">
            <a href={user.website} target="_blank" rel="noopener noreferrer" style={{ color: '#4a9eff' }}>
              {user.website}
            </a>
          </div>
        )}
        <div className="profile-actions">
          <button className="pill wide" onClick={() => setShowEditModal(true)}>Edit profile</button>
          <button className="pill wide" onClick={handleShareProfile}>Share profile</button>
          {authUser && (
            <button 
              className="pill square" 
              aria-label="Logout"
              onClick={handleLogout}
              title="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#fff" strokeWidth="1.6"/>
                <polyline points="16 17 21 12 16 7" stroke="#fff" strokeWidth="1.6"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="#fff" strokeWidth="1.6"/>
              </svg>
            </button>
          )}
        </div>
        <div className="profile-highlights">
          <div className="highlight">
            <div className="highlight-ring"><div className="highlight-inner">+</div></div>
            <div className="label">New</div>
          </div>
          <div className="highlight">
            <div className="highlight-ring">
              <div className="highlight-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1511735643442-503bb3bd3485?q=80&w=300&auto=format&fit=crop)' }} />
            </div>
            <div className="label">mee</div>
          </div>
        </div>
        <div className="profile-tabs">
          <button className="tab active" title="Grid">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="7" stroke="#fff"/><rect x="14" y="3" width="7" height="7" stroke="#fff"/><rect x="3" y="14" width="7" height="7" stroke="#fff"/><rect x="14" y="14" width="7" height="7" stroke="#fff"/></svg>
          </button>
          <button className="tab" title="Reels">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#fff"/><path d="M3 9h18" stroke="#fff"/></svg>
          </button>
          <button className="tab" title="Tagged">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="8" r="3" stroke="#fff"/><path d="M5 21c1.2-3.5 4.5-5 7-5s5.8 1.5 7 5" stroke="#fff"/></svg>
          </button>
        </div>
      </div>
      <div className="profile-empty">
        <div className="empty-illustration" />
        <h3>Share Your Food Experiences</h3>
        <p>Start reviewing restaurants to share your foodie journey.</p>
      </div>
      {showEditModal && (
        <EditProfile onClose={() => setShowEditModal(false)} onSave={handleSaveProfile} />
      )}
    </div>
  )
}


