import { useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthProvider'
import apiClient from '../api/client'
import StoryViewer from './StoryViewer'

export default function Stories() {
  const [stories, setStories] = useState([])
  const [userStories, setUserStories] = useState({})
  const [isUploading, setIsUploading] = useState(false)
  const [viewingStories, setViewingStories] = useState(null)
  const [viewingUserStories, setViewingUserStories] = useState([])
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      const data = await apiClient.getStories()
      setStories(data)
      
      // Group stories by user
      const grouped = {}
      data.forEach(story => {
        if (!grouped[story.user_id]) {
          grouped[story.user_id] = []
        }
        grouped[story.user_id].push(story)
      })
      setUserStories(grouped)
    } catch (e) {
      console.error('Failed to load stories', e)
    }
  }

  const handleAddStory = () => {
    if (!user) {
      alert('Please login to add stories')
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsUploading(true)
    try {
      await apiClient.createStory(file)
      await loadStories()
      alert('Story added successfully! It will expire in 24 hours.')
    } catch (error) {
      console.error('Failed to upload story:', error)
      alert('Failed to upload story. Please try again.')
    } finally {
      setIsUploading(false)
      e.target.value = '' // Reset input
    }
  }

  // Get unique users with their stories
  const uniqueUsers = Object.keys(userStories).map(userId => ({
    userId,
    stories: userStories[userId],
    latestStory: userStories[userId][0]
  }))

  // Get current user's stories
  const myUserId = user?.id
  const myStories = myUserId ? userStories[myUserId] : []
  const hasMyStories = myStories && myStories.length > 0

  const handleViewStories = (userId) => {
    const storiesForUser = userStories[userId] || []
    if (storiesForUser.length > 0) {
      setViewingUserStories(storiesForUser)
      setViewingStories(true)
    }
  }

  const handleCloseViewer = () => {
    setViewingStories(null)
    setViewingUserStories([])
  }

  return (
    <>
      <div className="stories">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        
        {/* Your story or add story button */}
        <div 
          className="story" 
          onClick={hasMyStories ? () => handleViewStories(myUserId) : handleAddStory} 
          style={{ cursor: 'pointer' }}
        >
          <div className="avatar">
            {hasMyStories ? (
              <div 
                className="avatar-inner" 
                style={{ 
                  backgroundImage: `url(${myStories[0].image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid #ff2c55'
                }} 
              />
            ) : (
              <div className="avatar-inner" style={{ 
                background: isUploading ? '#888' : 'linear-gradient(45deg, #ff2c55, #ffb703)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '24px'
              }}>
                {isUploading ? '⏳' : '+'}
              </div>
            )}
          </div>
          <div className="label">
            {isUploading ? 'Uploading...' : hasMyStories ? 'Your Story' : 'Add Story'}
          </div>
        </div>
        
        {/* Other users' stories */}
        {uniqueUsers
          .filter(({ userId }) => userId !== myUserId) // Don't show user's own story twice
          .map(({ userId, latestStory }) => (
            <div 
              key={userId} 
              className="story" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleViewStories(userId)}
            >
              <div className="avatar">
                <div 
                  className="avatar-inner" 
                  style={{ 
                    backgroundImage: `url(${latestStory.image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2px solid #ff2c55'
                  }} 
                />
              </div>
              <div className="label">
                {latestStory.user_username || latestStory.user_name?.split(' ')[0] || 'User'}
              </div>
            </div>
          ))}
      </div>

      {viewingStories && viewingUserStories.length > 0 && (
        <StoryViewer
          stories={viewingUserStories}
          onClose={handleCloseViewer}
        />
      )}
    </>
  )
}


