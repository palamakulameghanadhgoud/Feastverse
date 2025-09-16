export const reels = [
  {
    id: 'r1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Pasta vibes',
    restaurantId: 'rest1',
    likes: 1234,
  },
  {
    id: 'r2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Breakfast moments',
    restaurantId: 'rest2',
    likes: 980,
  },
  {
    id: 'r3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    title: 'Cafe latte art',
    restaurantId: 'rest3',
    likes: 201,
  },
]

export const restaurants = [
  {
    id: 'rest1',
    name: 'Casa Roma',
    cuisine: 'Italian',
    rating: 4.7,
    deliveryFee: 2.99,
    etaMins: 25,
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
    menu: [
      { id: 'm1', name: 'Truffle Pasta', price: 16.5 },
      { id: 'm2', name: 'Margherita Pizza', price: 12.0 },
      { id: 'm3', name: 'Tiramisu', price: 7.5 },
    ],
  },
  {
    id: 'rest2',
    name: 'Sunny Kitchen',
    cuisine: 'Breakfast',
    rating: 4.5,
    deliveryFee: 1.99,
    etaMins: 15,
    image:
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1200&auto=format&fit=crop',
    menu: [
      { id: 'm4', name: 'Eggs & Toast', price: 8.5 },
      { id: 'm5', name: 'Pancakes', price: 9.0 },
      { id: 'm6', name: 'Avocado Toast', price: 10.0 },
    ],
  },
  {
    id: 'rest3',
    name: 'Bean Scene',
    cuisine: 'Cafe',
    rating: 4.3,
    deliveryFee: 0,
    etaMins: 12,
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510661ed?q=80&w=1200&auto=format&fit=crop',
    menu: [
      { id: 'm7', name: 'Latte', price: 4.5 },
      { id: 'm8', name: 'Cappuccino', price: 4.0 },
      { id: 'm9', name: 'Blueberry Muffin', price: 3.5 },
    ],
  },
]

export const findRestaurantById = (id) => restaurants.find((r) => r.id === id)


