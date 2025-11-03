from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from datetime import datetime
from bson import ObjectId
import random
import os
import shutil
import tempfile

from .. import schemas, auth
from ..database import get_database
from ..models import UserDB
from ..email import send_welcome_email, send_username_change_email, send_profile_update_email
from ..cloudinary_service import upload_image

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/check-username", response_model=schemas.UsernameCheckResponse)
async def check_username(request: schemas.UsernameCheckRequest):
    """Check if username is available"""
    db = get_database()
    username = request.username.strip().lower()
    
    # Check if username exists
    existing = await db.users.find_one({"username": username})
    
    if existing:
        # Generate suggestions
        suggestions = []
        base = username
        for i in range(1, 4):
            num = random.randint(10, 999)
            suggestions.append(f"{base}{num}")
        
        return {"available": False, "suggestions": suggestions}
    
    return {"available": True, "suggestions": []}


@router.post("/google-login", response_model=schemas.Token)
async def google_login(request: schemas.GoogleAuthRequest):
    """Login with Google - for existing users"""
    db = get_database()
    google_info = auth.verify_google_token(request.token)
    
    # Check if user exists
    user = await db.users.find_one({"google_id": google_info["sub"]})
    
    if not user:
        # User doesn't exist - need to sign up
        raise HTTPException(
            status_code=404,
            detail="User not found. Please sign up first."
        )
    
    # User exists - generate token
    access_token = auth.create_access_token(data={"sub": str(user["_id"])})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_new_user": False,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "username": user.get("username"),
            "bio": user.get("bio"),
            "website": user.get("website"),
            "phone": user.get("phone"),
            "created_at": user["created_at"]
        }
    }


@router.post("/google-signup", response_model=schemas.Token)
async def google_signup(request: schemas.UserSignup):
    """Sign up with Google - creates new user with username"""
    db = get_database()
    google_info = auth.verify_google_token(request.google_token)
    
    # Check if user already exists
    existing_user = await db.users.find_one({"google_id": google_info["sub"]})
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists. Please login instead."
        )
    
    # Check if username is taken
    username = request.username.strip().lower()
    if await db.users.find_one({"username": username}):
        raise HTTPException(
            status_code=400,
            detail="Username already taken. Please choose another."
        )
    
    # Create new user
    user_data = UserDB(
        google_id=google_info["sub"],
        email=google_info["email"],
        name=google_info.get("name", ""),
        picture=google_info.get("picture"),
        username=username
    )
    
    result = await db.users.insert_one(user_data.dict(by_alias=True, exclude={"id"}))
    user = await db.users.find_one({"_id": result.inserted_id})
    
    # Send welcome email
    try:
        send_welcome_email(user["email"], username, user["name"])
    except Exception as e:
        print(f"Failed to send welcome email: {e}")
    
    # Generate token
    access_token = auth.create_access_token(data={"sub": str(user["_id"])})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_new_user": True,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture"),
            "username": user.get("username"),
            "bio": user.get("bio"),
            "website": user.get("website"),
            "phone": user.get("phone"),
            "created_at": user["created_at"]
        }
    }


@router.post("/check-google-user")
async def check_google_user(request: schemas.GoogleAuthRequest):
    """Check if Google user exists in database"""
    db = get_database()
    google_info = auth.verify_google_token(request.token)
    
    user = await db.users.find_one({"google_id": google_info["sub"]})
    
    return {
        "exists": user is not None,
        "email": google_info.get("email"),
        "name": google_info.get("name"),
        "picture": google_info.get("picture")
    }


@router.get("/me", response_model=schemas.User)
async def get_current_user_info(current_user: dict = Depends(auth.get_current_user)):
    """Get current authenticated user"""
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "name": current_user["name"],
        "picture": current_user.get("picture"),
        "username": current_user.get("username"),
        "bio": current_user.get("bio"),
        "website": current_user.get("website"),
        "phone": current_user.get("phone"),
        "created_at": current_user["created_at"]
    }


@router.patch("/me", response_model=schemas.User)
async def update_profile(
    user_update: schemas.UserUpdate,
    current_user: dict = Depends(auth.get_current_user)
):
    """Update current user's profile"""
    db = get_database()
    
    update_data = user_update.dict(exclude_unset=True)
    email_changes = {}
    
    # If username is being changed, check availability and send email
    if "username" in update_data and update_data["username"]:
        new_username = update_data["username"].strip().lower()
        
        # Check if username is taken by another user
        existing = await db.users.find_one({
            "username": new_username,
            "_id": {"$ne": ObjectId(current_user["_id"])}
        })
        
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
        
        old_username = current_user.get("username", "")
        
        # Send username change email (specific email for username)
        try:
            send_username_change_email(
                current_user["email"],
                old_username,
                new_username,
                current_user["name"]
            )
        except Exception as e:
            print(f"Failed to send username change email: {e}")
    
    # Track other profile changes (bio, website, phone)
    profile_fields = ["bio", "website", "phone"]
    for field in profile_fields:
        if field in update_data:
            email_changes[field] = update_data[field]
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": ObjectId(current_user["_id"])})
    
    # Send profile update email for bio, website, phone changes
    if email_changes:
        try:
            send_profile_update_email(
                current_user["email"],
                current_user["name"],
                updated_user.get("username", ""),
                email_changes
            )
        except Exception as e:
            print(f"Failed to send profile update email: {e}")
    
    return {
        "id": str(updated_user["_id"]),
        "email": updated_user["email"],
        "name": updated_user["name"],
        "picture": updated_user.get("picture"),
        "username": updated_user.get("username"),
        "bio": updated_user.get("bio"),
        "website": updated_user.get("website"),
        "phone": updated_user.get("phone"),
        "created_at": updated_user["created_at"]
    }


@router.post("/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: dict = Depends(auth.get_current_user)
):
    """Upload and set current user's profile picture (stored in Cloudinary)"""
    db = get_database()

    # Save to a temporary file
    suffix = os.path.splitext(file.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        result = upload_image(tmp_path, folder="feastverse/avatars")
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {result.get('error')}")

        await db.users.update_one(
            {"_id": ObjectId(current_user["_id"])},
            {"$set": {"picture": result["url"], "updated_at": datetime.utcnow()}}
        )

        # Send profile update email for avatar change
        try:
            send_profile_update_email(
                current_user["email"],
                current_user["name"],
                current_user.get("username", ""),
                {"picture": result["url"]}
            )
        except Exception as e:
            print(f"Failed to send avatar update email: {e}")

        return {"picture": result["url"]}
    finally:
        try:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        except Exception:
            pass
