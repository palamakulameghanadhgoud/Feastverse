# Feastverse Backend API (MongoDB Atlas)

FastAPI backend with MongoDB Atlas for the Feastverse platform.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Create .env File
Create `.env` file in this directory:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=feastverse
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=43200
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

Generate SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Run Server
```bash
python run.py
```

API will be available at:
- http://localhost:8000
- Docs: http://localhost:8000/docs

## MongoDB Atlas

This backend uses MongoDB Atlas (cloud MongoDB).

Collections:
- `users` - User accounts
- `restaurants` - Restaurant data
- `reels` - Video content
- `reviews` - Restaurant reviews
- `orders` - User orders

## API Endpoints

### Authentication
- `POST /auth/google` - Google OAuth login
- `GET /auth/me` - Get current user
- `PATCH /auth/me` - Update profile

### Restaurants
- `GET /restaurants` - List restaurants
- `GET /restaurants/{id}` - Get restaurant
- `POST /restaurants` - Create restaurant
- `POST /restaurants/{id}/menu` - Add menu item
- `POST /restaurants/{id}/follow` - Follow
- `POST /restaurants/{id}/subscribe` - Subscribe

### Reviews
- `GET /reviews/restaurant/{id}` - Get reviews
- `POST /reviews` - Create review
- `DELETE /reviews/{id}` - Delete review

### Reels
- `GET /reels` - List reels
- `POST /reels` - Upload reel
- `POST /reels/{id}/like` - Like reel

### Orders
- `GET /orders` - Get my orders
- `POST /orders` - Create order
- `PATCH /orders/{id}/status` - Update status

## Features

✅ MongoDB Atlas integration
✅ Google OAuth authentication
✅ JWT tokens
✅ File uploads
✅ RESTful API
✅ Auto-generated docs
✅ CORS enabled
✅ Async/await support

## Tech Stack

- FastAPI
- Motor (async MongoDB driver)
- MongoDB Atlas
- Pydantic
- Google Auth
- JWT tokens

## Development

```bash
# Run with auto-reload
python run.py

# Access docs
http://localhost:8000/docs
```
