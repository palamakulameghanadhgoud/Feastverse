export default function Stories() {
  // Stories will be dynamically populated by users
  const stories = []

  if (stories.length === 0) {
    return (
      <div className="stories">
        <div className="story">
          <div className="avatar">
            <div className="avatar-inner" style={{ 
              background: 'linear-gradient(45deg, #ff2c55, #ffb703)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '24px'
            }}>
              +
            </div>
          </div>
          <div className="label">Add Story</div>
        </div>
      </div>
    )
  }

  return (
    <div className="stories">
      {stories.map((s) => (
        <div key={s.id} className="story">
          <div className="avatar">
            <div className="avatar-inner" style={{ backgroundImage: `url(${s.image})` }} />
          </div>
          <div className="label">{s.name}</div>
        </div>
      ))}
    </div>
  )
}


