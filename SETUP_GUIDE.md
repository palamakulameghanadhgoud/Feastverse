# Feastverse Setup Guide

Complete guide to set up and run the Feastverse application (Frontend + Backend).

## Prerequisites

- Node.js (v18 or higher)
- Python (3.9 or higher)
- Google Cloud Console account (for OAuth)

## Part 1: Backend Setup

### 1. Navigate to backend directory
```bash
cd Feastverse/backend
```

### 2. Create virtual environment (optional but recommended)
```bash
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 3. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 4. Create .env file
```bash
# Copy example
cp .env.example .env
```

### 5. Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the output and paste it in `.env` as `SECRET_KEY`

### 6. Edit .env file
```env
DATABASE_URL=sqlite:///./feastverse.db
SECRET_KEY=<paste-generated-secret-key-here>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### 7. Run the backend server
```bash
python run.py
```

✅ Backend is now running at http://localhost:8000

Visit http://localhost:8000/docs to see the API documentation

## Part 2: Frontend Setup

### 1. Navigate to frontend directory
```bash
cd Feastverse/feastverse
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Create .env file
Create a file named `.env` in the `Feastverse/feastverse/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_API_URL=http://localhost:8000
```

### 4. Run the frontend development server
```bash
npm run dev
```

✅ Frontend is now running at http://localhost:5173

## Part 3: Google OAuth Configuration

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Configure OAuth 2.0 Client

Navigate to: **APIs & Services** > **Credentials**

Click your OAuth Client ID: `830474179707-op5qs67ft5ijgdjqjhmnnab2tk52on6g`

### 3. Add Authorized JavaScript origins
```
http://localhost:5173
http://127.0.0.1:5173
```

### 4. Add Authorized redirect URIs
```
http://localhost:5173
http://127.0.0.1:5173
http://localhost:5173/
http://127.0.0.1:5173/
```

### 5. Save and wait
Click **SAVE** and wait 1-2 minutes for changes to propagate.

## Running the Application

### Terminal 1 - Backend
```bash
cd Feastverse/backend
python run.py
```

### Terminal 2 - Frontend
```bash
cd Feastverse/feastverse
npm run dev
```

### Access the App
Open your browser and go to: **http://localhost:5173**

## Testing the Setup

1. **Sign in with Google** - Test OAuth authentication
2. **Create a Restaurant** - Test restaurant creation
3. **Add Menu Items** - Test menu management
4. **Write a Review** - Test review system
5. **Place an Order** - Test order flow
6. **Upload a Reel** - Test file upload

## Troubleshooting

### OAuth Error: redirect_uri_mismatch
- Check Google Cloud Console URIs match exactly
- Try both `localhost` and `127.0.0.1`
- Clear browser cache
- Wait 1-2 minutes after saving changes

### Backend Won't Start
- Check Python version: `python --version` (need 3.9+)
- Activate virtual environment
- Install dependencies: `pip install -r requirements.txt`
- Check `.env` file exists and has SECRET_KEY

### Frontend Won't Start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Check `.env` file exists

### Database Issues
- Delete `feastverse.db` and restart backend to reset database
- Check write permissions in backend directory

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default Ports

- Backend API: http://localhost:8000
- Frontend: http://localhost:5173

## Next Steps

1. Create restaurants using the API or frontend
2. Upload reels with videos
3. Write reviews
4. Place orders
5. Explore the social features (follow, subscribe, like)

Enjoy Feastverse! 🍽️📱

