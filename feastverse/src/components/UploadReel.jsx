import { useState, useRef } from 'react'
import { useAuth } from './AuthProvider'
import apiClient from '../api/client'

export default function UploadReel({ onClose, onSuccess }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please select a video file')
        return
      }

      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024 // 100MB
      if (file.size > maxSize) {
        alert('Video file is too large. Maximum size is 100MB.')
        return
      }

      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert('Please login to upload reels')
      return
    }

    if (!title.trim()) {
      alert('Please enter a title for your reel')
      return
    }

    if (!videoFile) {
      alert('Please select a video file')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      await apiClient.createReel(title, videoFile)
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      alert('Reel uploaded successfully!')
      
      if (onSuccess) {
        onSuccess()
      }
      
      onClose()
    } catch (error) {
      console.error('Failed to upload reel:', error)
      alert(`Failed to upload reel: ${error.message}`)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Reel</h2>
          <button className="close-btn" onClick={handleCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            
            {!videoFile ? (
              <div 
                onClick={handleFileSelect}
                style={{
                  border: '2px dashed #555',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#1a1a1a',
                  marginBottom: '20px'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📹</div>
                <p style={{ color: '#fff', marginBottom: '5px' }}>Click to select a video</p>
                <p style={{ color: '#888', fontSize: '12px' }}>MP4, MOV, AVI (max 100MB)</p>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <video
                  src={previewUrl}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    backgroundColor: '#000'
                  }}
                />
                <button
                  type="button"
                  onClick={handleFileSelect}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: '#333',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Change Video
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your reel a catchy title"
              disabled={isUploading}
              maxLength={100}
            />
            <p style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
              {title.length}/100 characters
            </p>
          </div>

          {isUploading && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#333', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  backgroundColor: '#4a9eff',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ color: '#888', fontSize: '12px', marginTop: '5px', textAlign: 'center' }}>
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isUploading || !videoFile || !title.trim()}
            >
              {isUploading ? 'Uploading...' : 'Upload Reel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

