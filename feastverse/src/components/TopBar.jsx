export default function TopBar() {
  return (
    <header className="topbar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img 
          src="/wa.png" 
          alt="FeastVerse Logo" 
          style={{ 
            height: '32px', 
            width: 'auto',
            objectFit: 'contain'
          }} 
        />
        <span>FeastVerse</span>
      </div>
      <div className="top-actions">
        <button className="icon-btn" title="Activity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" stroke="#fff" strokeWidth="1.6" fill="none"/></svg>
        </button>
        <button className="icon-btn" title="Messages">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12c0 3.866-4.03 7-9 7a10.6 10.6 0 01-2.6-.33L3 20.5l1.9-3.17C3.74 16.07 3 14.1 3 12 3 8.134 7.03 5 12 5s9 3.134 9 7z" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </header>
  )
}


