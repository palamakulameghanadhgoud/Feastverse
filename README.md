# 🍽️ Feastverse - The Ultimate Food Social Platform

A full-stack food delivery and social media platform with Google OAuth, video reels, reviews, and real-time ordering.

## ✨ What's New

### 🔐 Smart Authentication
- **Separate Login/Signup** - Existing users login automatically, new users choose username
- **Username System** - Unique @username with real-time availability check
- **Email Notifications** - Beautiful welcome emails and username change confirmations

### ☁️ Cloud Storage
- **Cloudinary Integration** - All videos stored in cloud with auto-generated thumbnails
- **No Local Storage** - Videos delivered via global CDN
- **Automatic Cleanup** - Videos deleted from cloud when removed

### 📧 Email Service
- **Welcome Emails** - Professional HTML emails on signup
- **Notifications** - Username change confirmations
- **Optional** - Can be disabled for development

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

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Lightning-fast build tool
- **Google OAuth** - `@react-oauth/google`
- **Modern CSS** - Grid & Flexbox layouts

## 🌟 Key Features

### Authentication
✅ Google OAuth Login/Signup
✅ Username selection & validation
✅ Profile management
✅ Session persistence

### Content
✅ Upload video reels (Cloudinary)
✅ Write restaurant reviews
✅ Follow restaurants
✅ Like content
✅ Share stories

### Commerce
✅ Browse restaurants
✅ View menus
✅ Add to cart
✅ Place orders
✅ Track delivery

### Social
✅ User profiles
✅ Follow system
✅ Subscription notifications
✅ Like & comment features

## 🔑 Required Services

### 1. MongoDB Atlas (Database)
- Sign up: https://www.mongodb.com/cloud/atlas
- FREE M0 tier available
- Get connection string for `.env`

### 2. Cloudinary (Pre-configured)
```
Cloud Name: dontgpfyd
API Key: 373724797657957
API Secret: ntimzsRi2ziTjADN8Dd4QykzFcc
```

### 3. Google OAuth (Pre-configured)
```
Client ID: 830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g
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
│   │   ├── models.py        # MongoDB models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # Authentication logic
│   │   ├── email.py         # Email templates & sender
│   │   ├── cloudinary_service.py  # Video upload
│   │   ├── database.py      # MongoDB connection
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Server startup
│
├── feastverse/             # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── AuthFlow.jsx      # Login/Signup flow
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── ReelsFeed.jsx     # Video feed
│   │   │   └── ...
│   │   ├── api/
│   │   │   └── client.js   # API client
│   │   ├── App.jsx         # Main app
│   │   └── App.css         # Styles
│   └── package.json
│
└── Documentation/
    ├── COMPLETE_SETUP_GUIDE.md
    ├── ENV_SETUP_COMPLETE.txt
    ├── FEATURES.md
    └── MONGODB_SETUP.md
```

## 🎯 API Endpoints

### Authentication
- `POST /auth/check-google-user` - Check user exists
- `POST /auth/google-login` - Login
- `POST /auth/google-signup` - Signup
- `POST /auth/check-username` - Username availability
- `GET /auth/me` - Current user
- `PATCH /auth/me` - Update profile

### Full API Docs
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

## 🆘 Support

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

**"Failed to upload video"**
```
Check Cloudinary credentials in backend/.env
Ensure all 3 values are set correctly
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
- ✅ Cloudinary video storage
- ✅ Email notifications
- ✅ Username system
- ✅ 150+ features ready to go

**Start building the future of food social media!** 🚀

---

Made with ❤️ for food lovers everywhere

