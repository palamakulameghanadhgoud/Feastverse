from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from contextlib import asynccontextmanager

from .config import settings
from .database import connect_to_mongo, close_mongo_connection
from .routers import auth, restaurants, reviews, reels, orders, stories, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()


app = FastAPI(
    title="Feastverse API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow production and development origins
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production frontend URL if configured
if settings.FRONTEND_URL:
    allowed_origins.append(settings.FRONTEND_URL)
    # Also allow without trailing slash if it has one
    if settings.FRONTEND_URL.endswith("/"):
        allowed_origins.append(settings.FRONTEND_URL.rstrip("/"))

# Allow all onrender.com domains for easier deployment
allowed_origins.extend([
    "https://feastverse-frontend.onrender.com",
    "https://feastverse.onrender.com",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Create upload directory
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(exist_ok=True)

# Mount static files
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(restaurants.router)
app.include_router(reviews.router)
app.include_router(reels.router)
app.include_router(orders.router)
app.include_router(stories.router)
app.include_router(users.router)


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Feastverse API",
        "version": "1.0.0",
        "database": "MongoDB Atlas",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "MongoDB Atlas"}
