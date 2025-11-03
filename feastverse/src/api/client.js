const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('access_token')
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('access_token', token)
    } else {
      localStorage.removeItem('access_token')
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const config = {
      ...options,
      headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.detail || 'Request failed')
    }

    return response.json()
  }

  // Auth
  async googleAuth(token) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
    this.setToken(data.access_token)
    return data
  }

  async getCurrentUser() {
    return this.request('/auth/me')
  }

  async updateProfile(profileData) {
    return this.request('/auth/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    })
  }

  async uploadAvatar(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)

    const headers = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/auth/me/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload avatar')
    }

    return response.json()
  }

  async getUserByUsername(username) {
    return this.request(`/users/${username}`, { skipAuth: true })
  }

  // Restaurants
  async getRestaurants() {
    return this.request('/restaurants')
  }

  async getRestaurant(id) {
    return this.request(`/restaurants/${id}`)
  }

  async createRestaurant(restaurantData) {
    return this.request('/restaurants', {
      method: 'POST',
      body: JSON.stringify(restaurantData),
    })
  }

  async addMenuItem(restaurantId, menuItem) {
    return this.request(`/restaurants/${restaurantId}/menu`, {
      method: 'POST',
      body: JSON.stringify(menuItem),
    })
  }

  async followRestaurant(id) {
    return this.request(`/restaurants/${id}/follow`, { method: 'POST' })
  }

  async unfollowRestaurant(id) {
    return this.request(`/restaurants/${id}/follow`, { method: 'DELETE' })
  }

  async subscribeRestaurant(id) {
    return this.request(`/restaurants/${id}/subscribe`, { method: 'POST' })
  }

  async unsubscribeRestaurant(id) {
    return this.request(`/restaurants/${id}/subscribe`, { method: 'DELETE' })
  }

  // Reviews
  async getRestaurantReviews(restaurantId) {
    return this.request(`/reviews/restaurant/${restaurantId}`)
  }

  async getMyReviews() {
    return this.request('/reviews/user/me')
  }

  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, { method: 'DELETE' })
  }

  // Reels
  async getReels() {
    return this.request('/reels')
  }

  async createReel(title, videoFile, restaurantId = null) {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('video', videoFile)
    if (restaurantId) {
      formData.append('restaurant_id', restaurantId)
    }

    const headers = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/reels`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload reel')
    }

    return response.json()
  }

  async likeReel(id) {
    return this.request(`/reels/${id}/like`, { method: 'POST' })
  }

  async unlikeReel(id) {
    return this.request(`/reels/${id}/like`, { method: 'DELETE' })
  }

  async deleteReel(id) {
    return this.request(`/reels/${id}`, { method: 'DELETE' })
  }

  // Orders
  async getOrders() {
    return this.request('/orders')
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async updateOrderStatus(id) {
    return this.request(`/orders/${id}/status`, { method: 'PATCH' })
  }

  // Stories
  async getStories() {
    return this.request('/stories')
  }

  async createStory(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)

    const headers = {}
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseURL}/stories`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload story')
    }

    return response.json()
  }
}

export default new APIClient()

