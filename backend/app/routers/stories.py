from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from datetime import datetime, timedelta
from bson import ObjectId
import os
import shutil
import tempfile

from .. import schemas, auth
from ..database import get_database
from ..models import StoryDB
from ..cloudinary_service import upload_image

router = APIRouter(prefix="/stories", tags=["stories"])


@router.get("/", response_model=List[schemas.Story])
async def get_stories():
    """Get active stories (not expired) with user information."""
    db = get_database()
    now = datetime.utcnow()
    stories = await db.stories.find({"expires_at": {"$gt": now}}).sort("created_at", -1).to_list(length=200)
    
    result = []
    for s in stories:
        # Get user info
        user = await db.users.find_one({"_id": ObjectId(s["user_id"])})
        story_data = {
            "id": str(s["_id"]),
            "user_id": s["user_id"],
            "image_url": s["image_url"],
            "created_at": s["created_at"],
            "expires_at": s["expires_at"],
        }
        # Add user info if available
        if user:
            story_data["user_name"] = user.get("name", "Unknown User")
            story_data["user_username"] = user.get("username", user.get("email", "").split("@")[0])
            story_data["user_picture"] = user.get("picture")
        
        result.append(story_data)
    
    return result


@router.post("/", response_model=schemas.Story)
async def create_story(
    file: UploadFile = File(...),
    current_user: dict = Depends(auth.get_current_user)
):
    """Create a story for current user (expires in 24h)."""
    db = get_database()

    suffix = os.path.splitext(file.filename)[1] or ".jpg"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        result = upload_image(tmp_path, folder="feastverse/stories")
        if not result.get("success"):
            raise HTTPException(status_code=500, detail=f"Failed to upload story: {result.get('error')}")

        story = StoryDB(
            user_id=str(current_user["_id"]),
            image_url=result["url"],
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        insert = await db.stories.insert_one(story.dict(by_alias=True, exclude={"id"}))
        created = await db.stories.find_one({"_id": insert.inserted_id})
        return {
            "id": str(created["_id"]),
            "user_id": created["user_id"],
            "image_url": created["image_url"],
            "created_at": created["created_at"],
            "expires_at": created["expires_at"],
        }
    finally:
        try:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        except Exception:
            pass
