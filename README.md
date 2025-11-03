# 🍽️ Feastverse - The Ultimate Food Social Platform

A full-stack food delivery and social media platform with Google OAuth, video reels, stories, reviews, and real-time ordering.

## ✨ Features

### 🔐 Authentication & Profiles
- **Google OAuth** - Secure login/signup with Google
- **Username System** - Unique @username with real-time availability check
- **Profile Management** - Update username, bio, website, phone
- **Profile Pictures** - Upload avatar to Cloudinary
- **Public Profiles** - Shareable profile URLs at `/u/{username}`
- **Email Notifications** - Welcome emails and username change confirmations

### 📹 Video Reels (Cloudinary)
- **Upload Reels** - Upload videos directly to Cloudinary with auto-thumbnails
- **Video Feed** - Infinite scroll feed with auto-play
- **Like/Unlike** - Real-time like counts persisted to database
- **Restaurant Tags** - Link reels to restaurants
- **Delete Reels** - Remove reels (also deletes from Cloudinary)

### � Instagram-Style Stories
- **24-Hour Stories** - Upload images that expire after 24 hours
- **Story Feed** - View active stories from users
- **Cloudinary Storage** - Images stored and served via CDN
- **Auto-Expiry** - Backend automatically filters expired stories

### ☁️ Cloud Infrastructure
- **Cloudinary Integration** - All media stored in cloud with CDN delivery
- **MongoDB Atlas** - Cloud NoSQL database
- **No Local Storage** - Everything in the cloud
- **Automatic Cleanup** - Videos/images deleted from cloud when removed

### 🎨 User Experience
- **Seamless Navigation** - Instant page changes (no refresh needed)
- **React Keys** - Proper component mounting/unmounting
- **Real Data Only** - No dummy likes/comments, only actual data
- **Image Cropping** - Built-in cropper for perfect profile pictures
- **Story Viewer** - Full-screen story viewing experience
- **Mobile First** - Optimized for mobile with touch gestures
- **Loading States** - Visual feedback for all async operations

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd Feastverse/backend
pip install -r requirements.txt
# Create .env file (see ENV_SETUP_COMPLETE.txt)
python run.py
```

### 2. Frontend Setup
```bash
cd Feastverse/feastverse
npm install
# Create .env file (see ENV_SETUP_COMPLETE.txt)
npm run dev
```

### 3. Open App
Visit: http://localhost:5173

## 📚 Documentation

- **COMPLETE_SETUP_GUIDE.md** - Full setup instructions with all services
- **ENV_SETUP_COMPLETE.txt** - Environment file templates
- **FEATURES.md** - Complete list of 150+ features
- **MONGODB_SETUP.md** - MongoDB Atlas specific setup

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Cloudinary** - Video & image storage CDN
- **Google OAuth** - Authentication
- **JWT** - Secure tokens
- **SMTP** - Email service
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Lightning-fast build tool
- **Google OAuth** - `@react-oauth/google`
- **react-easy-crop** - Image cropping functionality
- **Modern CSS** - Grid & Flexbox layouts
- **sessionStorage** - Client-side session management

## 🌟 Complete Feature List

### 🔐 Authentication & User Management
✅ Google OAuth Login/Signup  
✅ Username selection with real-time availability check  
✅ Profile editing (username, bio, website, phone)  
✅ Avatar upload to Cloudinary  
✅ Public shareable profile URLs (`/u/{username}`)  
✅ Session persistence with JWT  
✅ Welcome email on signup  
✅ Username change notification emails  

### 📹 Video Reels (Full Implementation)
✅ Upload video reels to Cloudinary  
✅ Auto-generate video thumbnails  
✅ Video feed with infinite scroll  
✅ Auto-play videos on scroll  
✅ Like/unlike reels (real-time counts)  
✅ Link reels to restaurants  
✅ Delete reels (removes from Cloudinary)  
✅ View reel details  

### 📸 Stories (Instagram-Style)
✅ Upload image stories (24-hour expiry)  
✅ View active stories feed  
✅ Auto-expire old stories  
✅ Cloudinary image storage  
✅ "Add Story" button for logged-in users  

### 🍽️ Restaurants & Ordering
✅ Browse restaurants  
✅ View restaurant menus  
✅ Follow/unfollow restaurants  
✅ Add items to cart  
✅ Place orders  
✅ Track order status  
✅ Order history  

### ⭐ Reviews & Social
✅ Write restaurant reviews  
✅ Rate restaurants (1-5 stars)  
✅ Like content  
✅ Follow system  
✅ Subscription notifications  

### 🎨 UI/UX
✅ Mobile-first responsive design  
✅ Bottom navigation bar  
✅ Top action bar  
✅ Modal dialogs  
✅ Loading states  
✅ Empty states with CTAs  
✅ Toast notifications

## 🔑 Required Services

### 1. MongoDB Atlas (Database)
- Sign up: https://www.mongodb.com/cloud/atlas
- FREE M0 tier available
- Get connection string for `.env`

### 2. Cloudinary (Pre-configured)
```
Cloud Name: your app name 
API Key: your api key
API Secret: your secret key
```

### 3. Google OAuth (Pre-configured)
```
Client ID: your client id
```

### 4. Email (Optional)
- Use Gmail SMTP or any service
- Configure in `.env`
- Can be disabled for development

## 📁 Project Structure

```
Feastverse/
├── backend/                  # Python FastAPI backend
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   │   ├── auth.py      # Auth endpoints (login/signup/profile)
│   │   │   ├── reels.py     # Reels endpoints (upload/like/delete)
│   │   │   ├── stories.py   # Stories endpoints (NEW)
│   │   │   ├── users.py     # Public profile endpoints (NEW)
│   │   │   ├── restaurants.py
│   │   │   ├── reviews.py
│   │   │   └── orders.py
│   │   ├── models.py        # MongoDB models (User, Reel, Story, etc.)
│   │   ├── schemas.py       # Pydantic validation schemas
│   │   ├── auth.py          # Authentication helpers (JWT, Google OAuth)
│   │   ├── email.py         # Email templates & SMTP sender
│   │   ├── cloudinary_service.py  # Video/image upload to Cloudinary
│   │   ├── database.py      # MongoDB connection
│   │   ├── config.py        # Environment settings
│   │   └── main.py          # FastAPI app initialization
│   ├── requirements.txt     # Python dependencies
│   ├── run.py              # Server startup script
│   └── .env                # Environment variables (create this)
│
├── feastverse/             # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AuthFlow.jsx      # Google OAuth flow
│   │   │   ├── Profile.jsx       # User profile with share URL
│   │   │   ├── EditProfile.jsx   # Edit profile + avatar upload (NEW)
│   │   │   ├── ReelsFeed.jsx     # Video feed from API
│   │   │   ├── Reel.jsx          # Single reel with like button
│   │   │   ├── UploadReel.jsx    # Upload modal (NEW)
│   │   │   ├── Stories.jsx       # Stories bar with upload (UPDATED)
│   │   │   ├── PublicProfile.jsx # Shareable profile page (NEW)
│   │   │   ├── TopBar.jsx        # Top bar with upload button
│   │   │   └── ...
│   │   ├── api/
│   │   │   └── client.js   # API client with all endpoints (UPDATED)
│   │   ├── App.jsx         # Main app router
│   │   ├── main.jsx        # Entry point with /u/:username routing
│   │   └── App.css         # Styles
│   ├── package.json
│   └── .env                # Frontend env vars (create this)
│
└── Documentation/
    ├── COMPLETE_SETUP_GUIDE.md
    ├── ENV_SETUP_COMPLETE.txt
    ├── FEATURES.md
    └── MONGODB_SETUP.md
```

## 🎯 API Endpoints

### Authentication
- `POST /auth/check-google-user` - Check if user exists
- `POST /auth/google-login` - Login existing user
- `POST /auth/google-signup` - Signup new user with username
- `POST /auth/check-username` - Check username availability
- `GET /auth/me` - Get current user profile
- `PATCH /auth/me` - Update profile (username, bio, etc.)
- `POST /auth/me/avatar` - Upload profile picture to Cloudinary

### Reels
- `GET /reels` - Get reels feed (paginated)
- `GET /reels/{id}` - Get single reel
- `POST /reels` - Upload video reel to Cloudinary
- `POST /reels/{id}/like` - Like a reel
- `DELETE /reels/{id}/like` - Unlike a reel
- `DELETE /reels/{id}` - Delete reel (owner only)

### Stories
- `GET /stories` - Get active stories (not expired)
- `POST /stories` - Upload story image (24h expiry)

### Users
- `GET /users/{username}` - Get public profile by username

### Restaurants
- `GET /restaurants` - List all restaurants
- `GET /restaurants/{id}` - Get restaurant details
- `POST /restaurants/{id}/follow` - Follow restaurant
- `POST /restaurants` - Create restaurant (authenticated)

### Reviews
- `GET /reviews` - List reviews
- `POST /reviews` - Create review (authenticated)

### Orders
- `GET /orders` - Get user orders
- `POST /orders` - Place new order
- `PATCH /orders/{id}/status` - Update order status

### Full Interactive API Docs
Visit: http://localhost:8000/docs (when backend is running)

## 📧 Email Templates

### Welcome Email
- Beautiful HTML design
- Feature introduction
- Username confirmation
- CTA button

### Username Change
- Confirmation email
- Before/after display
- Security notification

## 🔒 Security

- ✅ JWT token authentication
- ✅ Google OAuth verification
- ✅ CORS protection
- ✅ Environment variables
- ✅ Secure cloud storage
- ✅ Authorization checks

## 🌐 Deployment Ready

- ✅ Production-ready code
- ✅ Environment-based config
- ✅ Cloud database (MongoDB Atlas)
- ✅ Cloud storage (Cloudinary)
- ✅ Scalable architecture
- ✅ Error handling
- ✅ Logging

## 📱 Mobile Responsive

- ✅ Mobile-first design
- ✅ Touch-friendly UI
- ✅ Bottom navigation
- ✅ Optimized videos
- ✅ Responsive layouts
- ✅ Touch gestures for stories
- ✅ Viewport-based video playback
- ✅ Floating action buttons

## � How to Use Key Features

### Upload a Reel
1. Click the **+** button in the top bar
2. Enter a title for your reel
3. Select a video file (MP4, MOV, etc.)
4. Click "Upload" - video uploads to Cloudinary
5. Reel appears in feed with auto-generated thumbnail

### Add a Story
1. Click the **+** button in the Stories bar
2. Select an image file
3. Story uploads to Cloudinary and appears in feed
4. Automatically expires after 24 hours

### Update Profile
1. Go to Profile tab
2. Click "Edit profile"
3. Upload profile picture, change username, add bio/website/phone
4. Click "Save Changes" - avatar uploads to Cloudinary

### Share Your Profile
1. Go to Profile tab
2. Click "Share profile" button
3. URL like `http://localhost:5173/u/yourname` is copied
4. Share URL with anyone - they can view your public profile

### Like a Reel
1. Scroll through reels feed
2. Click the ❤️ heart icon on any reel
3. Like count updates in real-time
4. Like is persisted to MongoDB

## �🆘 Support

### Common Issues

**"VITE_GOOGLE_CLIENT_ID is not set"**
```
Create .env file in feastverse/ directory
Add: VITE_GOOGLE_CLIENT_ID=...
```

**"MONGODB_URL is required"**
```
Create .env file in backend/ directory
Add your MongoDB Atlas connection string
```

**"Username already taken"**
```
Try suggested usernames
Or modify with numbers/underscores
```

**"Failed to upload video/image"**
```bash
# Check Cloudinary credentials in backend/.env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Video/image size limits
Videos: under 100MB
Images: under 10MB
```

**"Stories not showing"**
```
Stories expire after 24 hours automatically
Upload a new story to see it in feed
Backend filters out expired stories
```

**"Reels not loading"**
```bash
# 1. Check backend is running
python backend/run.py
# Should see: Server running on http://0.0.0.0:8000

# 2. Check frontend API URL
# In feastverse/.env:
VITE_API_URL=http://localhost:8000

# 3. Check browser console for errors
```

**"Can't upload avatar"**
```
Stories expire after 24 hours
Upload a new story to see it appear
Click "Your Story" or any story ring to view
```

**Profile picture not cropping**
```
Make sure react-easy-crop is installed:
npm install react-easy-crop
```

### Documentation

- Full Setup: `COMPLETE_SETUP_GUIDE.md`
- Environment: `ENV_SETUP_COMPLETE.txt`
- Features: `FEATURES.md`
- MongoDB: `MONGODB_SETUP.md`

## 🤝 Contributing

This is a complete production-ready application with:
- 150+ features
- Full authentication system
- Cloud storage integration
- Email notifications
- Comprehensive API
- Beautiful UI/UX

## 📄 License

MIT License - Feel free to use for any purpose

## 🎉 Ready to Use!

Your Feastverse app includes everything:
- ✅ Complete backend with MongoDB Atlas
- ✅ React frontend with modern UI
- ✅ Google OAuth authentication
- ✅ **Cloudinary integration** - Videos, images, avatars all stored in cloud
- ✅ **Video Reels** - Upload, view, like/unlike with real-time counts
- ✅ **Instagram Stories** - 24-hour expiring image stories
- ✅ **Profile System** - Avatar upload, username change, shareable URLs
- ✅ **Email notifications** - Welcome & username change emails
- ✅ Restaurant ordering & reviews
- ✅ Real-time data (no mock/fake content)
- ✅ 150+ production-ready features

## 🆕 Latest Features (v3.0)

### 📹 Video Reels (Fully Implemented)
- ✅ Upload videos to Cloudinary via modal
- ✅ Auto-generated thumbnails
- ✅ Like/unlike with backend persistence
- ✅ Real-time like counts from MongoDB
- ✅ Delete reels (removes from Cloudinary)

### 📸 Instagram-Style Stories
- ✅ Upload images with 24-hour auto-expiry
- ✅ Stories bar with "Add Story" button
- ✅ Backend filters expired stories
- ✅ Cloudinary image storage

### 👤 Profile Enhancements
- ✅ Upload avatar to Cloudinary
- ✅ Change username with email notification
- ✅ Public shareable profile URLs (`/u/username`)
- ✅ Edit bio, website, phone

### 🔗 Public Profiles
- ✅ Share profile link with anyone
- ✅ View other users' public profiles
- ✅ `/u/{username}` route implemented

## 🚦 Quick Test Checklist

After starting both servers, test these features:

1. ✅ **Login** - Click "Continue with Google"
2. ✅ **Choose Username** - Pick unique username (gets welcome email)
3. ✅ **Upload Reel** - Click + button → select video → uploads to Cloudinary
4. ✅ **Like Reel** - Click ❤️ on any reel (count persists)
5. ✅ **Add Story** - Click + in Stories → select image (expires in 24h)
6. ✅ **Update Profile** - Profile → Edit → upload avatar + change username
7. ✅ **Share Profile** - Profile → Share → copies URL
8. ✅ **View Public Profile** - Visit `/u/{your-username}` in browser
9. ✅ **Browse Restaurants** - Navigate to Restaurants tab
10. ✅ **Place Order** - Add items to cart → checkout

All features work end-to-end with real cloud storage! 🎊
- ✨ Share profile with URL
- ✨ Floating upload button for reels
- ✨ User info on all reels and stories

### Bug Fixes
- 🐛 Navigation now instant (no refresh)
- 🐛 Username editing works properly
- 🐛 Profile reloads after editing
- 🐛 All forms properly validated
- 🐛 Real-time data synchronization

**Start building the future of food social media!** 🚀

---

Made with ❤️ for food lovers everywhere

