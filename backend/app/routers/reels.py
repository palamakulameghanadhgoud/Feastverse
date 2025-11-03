from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from datetime import datetime
from bson import ObjectId
import os
import shutil
from pathlib import Path
import tempfile

from .. import schemas, auth
from ..database import get_database
from ..models import ReelDB
from ..config import settings
from ..cloudinary_service import upload_video, delete_video, generate_video_thumbnail

router = APIRouter(prefix="/reels", tags=["reels"])


@router.get("/", response_model=List[schemas.Reel])
async def get_reels(skip: int = 0, limit: int = 100):
    """Get all reels with user information"""
    db = get_database()
    reels = await db.reels.find().sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
    
    result = []
    for reel in reels:
        # Count likes
        likes_count = await db.users.count_documents({
            "liked_reels": {"$in": [str(reel["_id"])]}
        })
        
        # Get user info
        user = await db.users.find_one({"_id": ObjectId(reel["user_id"])})
        
        reel_data = {
            "id": str(reel["_id"]),
            "user_id": reel["user_id"],
            "restaurant_id": reel.get("restaurant_id"),
            "title": reel["title"],
            "video_url": reel["video_url"],
            "thumbnail_url": reel.get("thumbnail_url"),
            "created_at": reel["created_at"],
            "likes": likes_count
        }
        
        # Add user info if available
        if user:
            reel_data["user_name"] = user.get("name", "Unknown User")
            reel_data["user_username"] = user.get("username", user.get("email", "").split("@")[0])
            reel_data["user_picture"] = user.get("picture")
        
        result.append(reel_data)
    
    return result


@router.get("/{reel_id}", response_model=schemas.Reel)
async def get_reel(reel_id: str):
    """Get a specific reel"""
    db = get_database()
    reel = await db.reels.find_one({"_id": ObjectId(reel_id)})
    
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    # Count likes
    likes_count = await db.users.count_documents({
        "liked_reels": {"$in": [reel_id]}
    })
    
    return {
        "id": str(reel["_id"]),
        "user_id": reel["user_id"],
        "restaurant_id": reel.get("restaurant_id"),
        "title": reel["title"],
        "video_url": reel["video_url"],
        "thumbnail_url": reel.get("thumbnail_url"),
        "created_at": reel["created_at"],
        "likes": likes_count
    }


@router.post("/", response_model=schemas.Reel)
async def create_reel(
    title: str = Form(...),
    video: UploadFile = File(...),
    restaurant_id: str = Form(None),
    current_user: dict = Depends(auth.get_current_user)
):
    """Create a new reel with video upload to Cloudinary"""
    db = get_database()
    
    # Create temporary file for upload
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(video.filename)[1]) as tmp_file:
        # Copy uploaded file to temp file
        shutil.copyfileobj(video.file, tmp_file)
        tmp_file_path = tmp_file.name
    
    try:
        # Upload to Cloudinary
        public_id = f"reel_{current_user['_id']}_{int(datetime.now().timestamp())}"
        upload_result = upload_video(tmp_file_path, public_id=public_id)
        
        if not upload_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload video: {upload_result.get('error')}"
            )
        
        # Generate thumbnail
        thumbnail_url = generate_video_thumbnail(upload_result["public_id"])
        
        # Create reel in database
        reel_data = ReelDB(
            user_id=str(current_user["_id"]),
            restaurant_id=restaurant_id,
            title=title,
            video_url=upload_result["url"],
            thumbnail_url=thumbnail_url
        )
        
        result = await db.reels.insert_one(
            reel_data.dict(by_alias=True, exclude={"id"})
        )
        
        created_reel = await db.reels.find_one({"_id": result.inserted_id})
        
        return {
            "id": str(created_reel["_id"]),
            "user_id": created_reel["user_id"],
            "restaurant_id": created_reel.get("restaurant_id"),
            "title": created_reel["title"],
            "video_url": created_reel["video_url"],
            "thumbnail_url": created_reel.get("thumbnail_url"),
            "created_at": created_reel["created_at"],
            "likes": 0
        }
    
    finally:
        # Clean up temporary file
        if os.path.exists(tmp_file_path):
            os.unlink(tmp_file_path)


@router.post("/{reel_id}/like")
async def like_reel(
    reel_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Like a reel"""
    db = get_database()
    
    reel = await db.reels.find_one({"_id": ObjectId(reel_id)})
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$addToSet": {"liked_reels": reel_id}}
    )
    
    # Count total likes
    likes_count = await db.users.count_documents({
        "liked_reels": {"$in": [reel_id]}
    })
    
    return {"message": "Reel liked successfully", "likes": likes_count}


@router.delete("/{reel_id}/like")
async def unlike_reel(
    reel_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Unlike a reel"""
    db = get_database()
    
    reel = await db.reels.find_one({"_id": ObjectId(reel_id)})
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$pull": {"liked_reels": reel_id}}
    )
    
    # Count total likes
    likes_count = await db.users.count_documents({
        "liked_reels": {"$in": [reel_id]}
    })
    
    return {"message": "Reel unliked successfully", "likes": likes_count}


@router.delete("/{reel_id}")
async def delete_reel(
    reel_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Delete a reel"""
    db = get_database()
    
    reel = await db.reels.find_one({"_id": ObjectId(reel_id)})
    if not reel:
        raise HTTPException(status_code=404, detail="Reel not found")
    
    if reel["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Extract Cloudinary public_id from URL and delete from Cloudinary
    video_url = reel.get("video_url", "")
    if "cloudinary.com" in video_url:
        # Extract public_id from Cloudinary URL
        try:
            # URL format: https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{public_id}.{format}
            parts = video_url.split("/")
            public_id_with_ext = "/".join(parts[parts.index("upload")+1:])
            public_id = public_id_with_ext.rsplit(".", 1)[0]
            delete_video(public_id)
        except Exception as e:
            print(f"Failed to delete video from Cloudinary: {e}")
    
    await db.reels.delete_one({"_id": ObjectId(reel_id)})
    
    return {"message": "Reel deleted successfully"}
