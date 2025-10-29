# Feastverse - Complete MongoDB Atlas Setup Guide

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account (no credit card required)
3. Click "Build a Database"

### 2. Create a Free Cluster
1. Choose **M0 Sandbox** (FREE tier)
2. Select a cloud provider (AWS, Google Cloud, or Azure)
3. Choose a region close to you
4. Click "Create Cluster"

### 3. Create Database User
1. Go to **Security** → **Database Access**
2. Click "Add New Database User"
3. Choose **Password** authentication
4. Username: `feastverse_user` (or any name you like)
5. Password: Create a strong password (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### 4. Allow Network Access
1. Go to **Security** → **Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - This adds `0.0.0.0/0`
4. Click "Confirm"

### 5. Get Connection String
1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Python**, Version: **3.12 or later**
5. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with your password
8. Keep this string safe!

## Part 2: Backend Setup

### 1. Navigate to backend directory
```bash
cd Feastverse/backend
```

### 2. Create Python Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create `.env` file

Create a file named `.env` in the `Feastverse/backend/` directory with these contents:

```env
# MongoDB Atlas Connection
MONGODB_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=feastverse

# JWT Secret (generate a random string)
SECRET_KEY=PASTE_GENERATED_SECRET_KEY_HERE
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# CORS
FRONTEND_URL=http://localhost:5173

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

**IMPORTANT:** Replace the following in your `.env` file:
- `YOUR_USERNAME` - Your MongoDB username
- `YOUR_PASSWORD` - Your MongoDB password  
- `cluster0.xxxxx` - Your actual cluster address
- `PASTE_GENERATED_SECRET_KEY_HERE` - Generate a secret key (see below)

### 5. Generate SECRET_KEY

Run this command to generate a secure secret key:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste it as your `SECRET_KEY` in `.env`

### 6. Start the Backend Server
```bash
python run.py
```

You should see:
```
Connected to MongoDB: feastverse
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is running!**

Visit http://localhost:8000/docs to see the API documentation

## Part 3: Frontend Setup

### 1. Navigate to frontend directory
```bash
cd Feastverse/feastverse
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Create Frontend `.env` file

Create a file named `.env` in `Feastverse/feastverse/` directory:

```env
VITE_GOOGLE_CLIENT_ID=830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g.apps.googleusercontent.com
VITE_API_URL=http://localhost:8000
```

### 4. Start Frontend Development Server
```bash
npm run dev
```

✅ **Frontend is running at http://localhost:5173**

## Part 4: Google OAuth Configuration

### 1. Go to Google Cloud Console
https://console.cloud.google.com/

### 2. Navigate to OAuth Settings
**APIs & Services** → **Credentials**

### 3. Click your OAuth Client ID
`830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g`

### 4. Add Authorized JavaScript Origins
```
http://localhost:5173
http://127.0.0.1:5173
```

### 5. Add Authorized Redirect URIs
```
http://localhost:5173
http://127.0.0.1:5173
http://localhost:5173/
http://127.0.0.1:5173/
```

### 6. Save and Wait
Click **SAVE** and wait 1-2 minutes for changes to propagate

## Running the Complete Application

### Terminal 1 - Backend
```bash
cd Feastverse/backend
# Activate venv if you created one
python run.py
```

### Terminal 2 - Frontend
```bash
cd Feastverse/feastverse
npm run dev
```

### Access the App
Open your browser: http://localhost:5173

## Verify MongoDB Connection

### 1. Check MongoDB Atlas Dashboard
- Go to your cluster in MongoDB Atlas
- Click "Collections"
- You should see a `feastverse` database appear after first use

### 2. Check Backend Logs
When you start the backend, you should see:
```
Connected to MongoDB: feastverse
```

### 3. Test API
Visit: http://localhost:8000/health

Should return:
```json
{
  "status": "healthy",
  "database": "MongoDB Atlas"
}
```

## Example .env Files

### Backend `.env` (Feastverse/backend/.env)
```env
MONGODB_URL=mongodb+srv://feastverse_user:MyPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
DB_NAME=feastverse
SECRET_KEY=XyZ123RandomSecretKey456Abc
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### Frontend `.env` (Feastverse/feastverse/.env)
```env
VITE_GOOGLE_CLIENT_ID=830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g.apps.googleusercontent.com
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### MongoDB Connection Issues

**Error: "Authentication failed"**
- Check your username and password in MONGODB_URL
- Ensure password is URL encoded (no special characters or encode them)
- Verify database user has "Read and write to any database" privileges

**Error: "Connection timeout"**
- Check Network Access in MongoDB Atlas
- Ensure "0.0.0.0/0" is in the IP whitelist
- Check your internet connection

**Error: "Database name not found"**
- The database will be created automatically on first use
- Just make sure `DB_NAME=feastverse` is in your `.env`

### Backend Won't Start

**Error: "No module named 'motor'"**
```bash
pip install -r requirements.txt
```

**Error: "SECRET_KEY is required"**
- Generate a secret key and add it to `.env`
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Add all redirect URIs in Google Cloud Console
- Try both `localhost` and `127.0.0.1`
- Wait 1-2 minutes after saving
- Clear browser cache

## Testing the Setup

### 1. Sign in with Google
- Open http://localhost:5173
- Click "Continue with Google"
- Sign in with your Google account

### 2. Create a Restaurant
- Use the API at http://localhost:8000/docs
- Or create via frontend (if implemented)

### 3. Check MongoDB
- Go to MongoDB Atlas
- Click "Collections"
- You should see:
  - `users` collection
  - `restaurants` collection
  - Other collections as you use features

## Features Available

✅ Google OAuth Authentication
✅ User Profile Management
✅ Restaurant CRUD
✅ Menu Management
✅ Reviews & Ratings
✅ Video Reels Upload
✅ Orders & Cart
✅ Follow/Subscribe Restaurants
✅ Like Reels

## API Documentation

Once backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Production Deployment

For production:
1. Create a production MongoDB cluster
2. Update IP whitelist to specific IPs only
3. Use strong passwords
4. Enable MongoDB backup
5. Use environment variables for secrets
6. Deploy backend to cloud (Heroku, Railway, AWS)
7. Deploy frontend to Vercel/Netlify
8. Update CORS origins
9. Enable HTTPS

---

🎉 **Congratulations!** Your Feastverse app with MongoDB Atlas is ready!

For support, check:
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- FastAPI Docs: https://fastapi.tiangolo.com/
- React Docs: https://react.dev/

