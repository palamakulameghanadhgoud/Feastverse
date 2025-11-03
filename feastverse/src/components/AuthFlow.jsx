import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from './AuthProvider'
import { useStore } from '../store.jsx'
import apiClient from '../api/client'

export default function AuthFlow() {
  const { login } = useAuth()
  const { dispatch } = useStore()
  const [step, setStep] = useState('choice') // 'choice', 'username'
  const [googleToken, setGoogleToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)
      try {
        // Check if user exists
        const checkResponse = await apiClient.request('/auth/check-google-user', {
          method: 'POST',
          body: JSON.stringify({ token: tokenResponse.access_token }),
        })

        if (checkResponse.exists) {
          // User exists - login
          const loginData = await apiClient.request('/auth/google-login', {
            method: 'POST',
            body: JSON.stringify({ token: tokenResponse.access_token }),
          })
          
          login(loginData.user)
          apiClient.setToken(loginData.access_token)
          dispatch({ type: 'NAVIGATE', payload: { route: 'feed', params: {} } })
        } else {
          // New user - go to username selection
          setGoogleToken(tokenResponse.access_token)
          setUserInfo(checkResponse)
          setStep('username')
        }
      } catch (error) {
        console.error('Auth error:', error)
        alert(error.message || 'Authentication failed')
      } finally {
        setLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error)
      alert('Google sign in failed. Please try again.')
    },
  })

  const checkUsername = async (username) => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters')
      return false
    }

    try {
      const response = await apiClient.request('/auth/check-username', {
        method: 'POST',
        body: JSON.stringify({ username }),
      })

      if (!response.available) {
        setUsernameError(`Username taken. Try: ${response.suggestions.join(', ')}`)
        return false
      }

      setUsernameError('')
      return true
    } catch (error) {
      setUsernameError('Error checking username')
      return false
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const isValid = await checkUsername(username)
      if (!isValid) {
        setLoading(false)
        return
      }

      const signupData = await apiClient.request('/auth/google-signup', {
        method: 'POST',
        body: JSON.stringify({
          google_token: googleToken,
          username: username.trim().toLowerCase(),
        }),
      })

      login(signupData.user)
      apiClient.setToken(signupData.access_token)
      dispatch({ type: 'NAVIGATE', payload: { route: 'feed', params: {} } })
    } catch (error) {
      console.error('Signup error:', error)
      setUsernameError(error.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'username') {
    return (
      <div className="auth-flow">
        <div className="auth-container">
          <div className="auth-header">
            <img 
              src="/wa.png" 
              alt="FeastVerse Logo" 
              style={{ 
                height: '60px', 
                width: 'auto',
                marginBottom: '20px',
                objectFit: 'contain'
              }} 
            />
            <h1>Welcome to Feastverse! 🍽️</h1>
            <p>Choose your username</p>
            {userInfo && (
              <div className="user-info">
                <img src={userInfo.picture} alt={userInfo.name} className="user-avatar" />
                <div>
                  <div className="user-name">{userInfo.name}</div>
                  <div className="user-email">{userInfo.email}</div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSignup} className="username-form">
            <div className="form-group">
              <label>Username</label>
              <div className="username-input-group">
                <span className="username-prefix">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setUsernameError('')
                  }}
                  onBlur={() => username && checkUsername(username)}
                  placeholder="yourname"
                  pattern="[a-z0-9_]+"
                  minLength={3}
                  maxLength={30}
                  required
                  disabled={loading}
                />
              </div>
              {usernameError && <div className="error-message">{usernameError}</div>}
              <div className="hint">Use only lowercase letters, numbers, and underscores</div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading || usernameError}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setStep('choice')
                setUsername('')
                setUsernameError('')
              }}
              disabled={loading}
            >
              Back
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-flow">
      <div className="auth-container">
        <div className="auth-header">
          <img 
            src="/wa.png" 
            alt="FeastVerse Logo" 
            style={{ 
              height: '80px', 
              width: 'auto',
              marginBottom: '20px',
              objectFit: 'contain'
            }} 
          />
          <h1>Welcome to Feastverse</h1>
          <p>Discover amazing food experiences</p>
        </div>

        <div className="auth-options">
          <button
            className="google-auth-btn"
            onClick={() => handleGoogleAuth()}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="auth-divider">
            <span>Sign in or Sign up</span>
          </div>

          <p className="auth-note">
            New to Feastverse? We'll help you create an account after you sign in with Google.
          </p>
        </div>
      </div>
    </div>
  )
}

