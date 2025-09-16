import { useStore } from '../store.jsx'

export default function Profile() {
  const { state } = useStore()
  const user = {
    username: 'meghanadhgoud_',
    fullName: 'Meghanadh Goud',
    avatar:
      'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop',
    posts: 0,
    followers: 157,
    following: 228,
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
        <div className="profile-actions">
          <button className="pill wide">Edit profile</button>
          <button className="pill wide">Share profile</button>
          <button className="pill square" aria-label="Add person">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="7" r="4" stroke="#fff" strokeWidth="1.6"/><path d="M2 21c1.8-4.5 6.2-5.5 9-5.5" stroke="#fff" strokeWidth="1.6"/><path d="M19 10v8M15 14h8" stroke="#fff" strokeWidth="1.6"/></svg>
          </button>
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
        <h3>Create your first post</h3>
        <p>Give this space some love.</p>
      </div>
    </div>
  )
}


