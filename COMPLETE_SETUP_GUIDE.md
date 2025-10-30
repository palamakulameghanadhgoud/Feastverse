# Feastverse - Complete Setup Guide with All Features

## ✨ New Features
- 🔐 Separate Login/Signup flow
- 📧 Welcome emails from Feastverse
- 👤 Username selection during signup
- ✏️ Username can be changed anytime
- ☁️ Videos stored in Cloudinary (no local storage)
- 🎬 Auto-generated video thumbnails

## Required Services

### 1. MongoDB Atlas (Database)
- Sign up: https://www.mongodb.com/cloud/atlas
- Create FREE M0 cluster
- Get connection string

### 2. Cloudinary (Video Storage)
- Already provided:
  - Cloud name: `dontgpfyd`
  - API key: `373724797657957`
  - API secret: `ntimzsRi2ziTjADN8Dd4QykzFcc`

### 3. Google OAuth (Authentication)
- Already configured
- Client ID: `830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g`

### 4. Email (Optional)
- For welcome emails
- Use Gmail SMTP or any email service
- Can be enabled later

## Backend Setup

### 1. Create `.env` file

**Location:** `Feastverse/backend/.env`

```env
# MongoDB Atlas
MONGODB_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority
DB_NAME=feastverse

# JWT Secret
SECRET_KEY=GENERATE_THIS_BELOW
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary (Video Storage)
CLOUDINARY_CLOUD_NAME=dontgpfyd
CLOUDINARY_API_KEY=373724797657957
CLOUDINARY_API_SECRET=ntimzsRi2ziTjADN8Dd4QykzFcc

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Email Settings (Optional - for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@feastverse.com
EMAILS_FROM_NAME=Feastverse
EMAILS_ENABLED=false
```

### 2. Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```
Copy output and paste as `SECRET_KEY` in `.env`

### 3. Install Dependencies
```bash
cd Feastverse/backend
pip install -r requirements.txt
```

### 4. Run Backend
```bash
python run.py
```

✅ Backend at: http://localhost:8000
✅ API Docs: http://localhost:8000/docs

## Frontend Setup

### 1. Create `.env` file

**Location:** `Feastverse/feastverse/.env`

```env
VITE_GOOGLE_CLIENT_ID=830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g.apps.googleusercontent.com
VITE_API_URL=http://localhost:8000
```

### 2. Install Dependencies
```bash
cd Feastverse/feastverse
npm install
```

### 3. Run Frontend
```bash
npm run dev
```

✅ Frontend at: http://localhost:5173

## Google OAuth Setup

1. Go to: https://console.cloud.google.com/
2. Navigate to: APIs & Services → Credentials
3. Click OAuth Client ID
4. Add **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   ```
5. Add **Authorized redirect URIs:**
   ```
   http://localhost:5173
   http://127.0.0.1:5173
   http://localhost:5173/
   http://127.0.0.1:5173/
   ```
6. Click SAVE and wait 1-2 minutes

## Email Setup (Optional)

### For Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use app password in `.env`:
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   EMAILS_ENABLED=true
   ```

### Welcome Email Features:
- ✉️ Sent automatically on signup
- 🎨 Beautiful HTML template
- 📧 Username confirmation
- 🔄 Username change notifications

## New User Flow

### 1. First Time User
1. Click "Continue with Google"
2. Choose Google account
3. System checks if user exists
4. If new → Username selection screen
5. Choose unique username (e.g., `@foodlover123`)
6. Account created + Welcome email sent
7. Redirected to feed

### 2. Existing User
1. Click "Continue with Google"
2. Choose Google account
3. Automatically logged in
4. Redirected to feed

### 3. Username Features
- ✅ Must be 3-30 characters
- ✅ Only lowercase letters, numbers, underscore
- ✅ Check availability in real-time
- ✅ Get suggestions if taken
- ✅ Change anytime in profile settings
- ✅ Email notification on change

## Video Upload with Cloudinary

### Features:
- ☁️ All videos stored in Cloudinary
- 🎬 Auto-generated thumbnails
- 📹 Optimized video delivery
- 🗑️ Auto-cleanup on delete
- 💾 No local storage needed

### How it Works:
1. User uploads video
2. Temporarily saved locally
3. Uploaded to Cloudinary
4. Local file deleted
5. Cloudinary URL saved in database
6. Video accessible globally

## MongoDB Collections

Your database will have:
- `users` - User accounts with usernames
- `restaurants` - Restaurant data
- `reels` - Video content (Cloudinary URLs)
- `reviews` - User reviews
- `orders` - Order history

## API Endpoints

### Authentication
- `POST /auth/check-google-user` - Check if user exists
- `POST /auth/google-login` - Login existing user
- `POST /auth/google-signup` - Signup new user with username
- `POST /auth/check-username` - Check username availability
- `GET /auth/me` - Get current user
- `PATCH /auth/me` - Update profile/username

### Other Features
- All restaurant, review, reel, order endpoints remain the same
- Reel uploads now use Cloudinary automatically

## Testing the Setup

### 1. Test Signup Flow
1. Open http://localhost:5173
2. Click "Continue with Google"
3. Sign in with Google
4. Choose username
5. Check email for welcome message
6. Verify redirect to feed

### 2. Test Login Flow
1. Logout
2. Click "Continue with Google"
3. Should login automatically (no username prompt)
4. Verify redirect to feed

### 3. Test Username Change
1. Go to Profile
2. Click "Edit profile"
3. Change username
4. Check email for confirmation
5. Verify new username appears

### 4. Test Video Upload
1. Create a reel
2. Upload video
3. Check Cloudinary dashboard
4. Verify video plays
5. Check thumbnail generated

## Cloudinary Dashboard

Visit: https://cloudinary.com/console

- Login with your credentials
- Check "Media Library" for uploaded videos
- Videos in: `feastverse/reels/` folder
- Monitor storage usage

## Troubleshooting

### Email Not Sending
```
Set EMAILS_ENABLED=false in .env
Emails will be logged to console instead
```

### Cloudinary Upload Fails
```
Check credentials in .env:
CLOUDINARY_CLOUD_NAME=dontgpfyd
CLOUDINARY_API_KEY=373724797657957
CLOUDINARY_API_SECRET=ntimzsRi2ziTjADN8Dd4QykzFcc
```

### Username Already Taken
```
Try suggested usernames
Or add numbers/underscores
Example: foodlover → foodlover_123
```

### OAuth Redirect Error
```
Add all these URIs:
http://localhost:5173
http://127.0.0.1:5173
http://localhost:5173/
http://127.0.0.1:5173/
```

## Production Deployment

### Before deploying:
1. ✅ Use production MongoDB cluster
2. ✅ Update FRONTEND_URL in backend .env
3. ✅ Update Google OAuth redirect URIs
4. ✅ Enable emails with production SMTP
5. ✅ Use environment variables for secrets
6. ✅ Cloudinary already production-ready

## Support

- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Cloudinary: https://cloudinary.com/documentation
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/

---

🎉 **Your Feastverse app is ready with all features!**

Enjoy building the future of food social media! 🍽️

