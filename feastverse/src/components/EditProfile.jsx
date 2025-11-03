import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import apiClient from '../api/client'
import ImageCropper from './ImageCropper'

export default function EditProfile({ onClose, onSave }) {
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    bio: '',
    website: '',
    phone: '',
  })
  const [profilePic, setProfilePic] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPic, setIsUploadingPic] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToCrop, setImageToCrop] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Load current user data
    const loadUserData = async () => {
      try {
        const userData = await apiClient.getCurrentUser()
        setFormData({
          username: userData.username || '',
          name: userData.name || '',
          bio: userData.bio || '',
          website: userData.website || '',
          phone: userData.phone || '',
        })
        setPreviewUrl(userData.picture)
      } catch (error) {
        console.error('Failed to load user data:', error)
      }
    }
    
    if (user) {
      loadUserData()
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Show cropper instead of directly setting the image
      const reader = new FileReader()
      reader.onload = () => {
        setImageToCrop(reader.result)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedBlob) => {
    // Convert blob to file
    const croppedFile = new File([croppedBlob], 'profile.jpg', { type: 'image/jpeg' })
    setProfilePic(croppedFile)
    setPreviewUrl(URL.createObjectURL(croppedBlob))
    setShowCropper(false)
    setImageToCrop(null)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setImageToCrop(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Upload profile picture if selected
      let pictureUrl = previewUrl
      if (profilePic) {
        setIsUploadingPic(true)
        const avatarResult = await apiClient.uploadAvatar(profilePic)
        pictureUrl = avatarResult.picture
        setIsUploadingPic(false)
      }

      // Prepare update data - only send fields that have values
      const updateData = {}
      
      if (formData.username && formData.username.trim()) {
        updateData.username = formData.username.trim()
      }
      
      if (formData.name && formData.name.trim()) {
        updateData.name = formData.name.trim()
      }
      
      if (formData.bio !== undefined && formData.bio !== null) {
        updateData.bio = formData.bio.trim()
      }
      
      if (formData.website && formData.website.trim()) {
        updateData.website = formData.website.trim()
      }
      
      if (formData.phone && formData.phone.trim()) {
        updateData.phone = formData.phone.trim()
      }

      console.log('Sending profile update:', updateData)

      // Update profile data
      const updatedUser = await apiClient.updateProfile(updateData)

      console.log('Profile updated:', updatedUser)

      // Update local user state with both API response and picture URL
      const newUserData = { ...user, ...updatedUser, picture: pictureUrl }
      login(newUserData)
      
      if (onSave) {
        onSave(updatedUser)
      }

      alert('Profile updated successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert(`Failed to update profile: ${error.message || 'Please check your input and try again.'}`)
    } finally {
      setIsSaving(false)
      setIsUploadingPic(false)
    }
  }

  return (
    <>
      {showCropper && imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div 
              onClick={handleImageClick}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto',
                cursor: 'pointer',
                backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
                backgroundColor: '#333',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '14px',
                border: '2px solid #555'
              }}
            >
              {!previewUrl && '+ Add Photo'}
              {isUploadingPic && '⏳'}
            </div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
              Click to change profile picture
            </p>
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

