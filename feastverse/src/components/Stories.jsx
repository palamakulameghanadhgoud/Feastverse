const sample = [
  {
    id: 'me',
    name: 'Your story',
    image:
      'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'rest1',
    name: 'Casa Roma',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'rest2',
    name: 'Sunny Kitchen',
    image:
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'rest3',
    name: 'Bean Scene',
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510661ed?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'chef',
    name: 'Chef Marco',
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
  },
]

export default function Stories() {
  return (
    <div className="stories">
      {sample.map((s) => (
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


