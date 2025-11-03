from fastapi import APIRouter, HTTPException
from ..database import get_database

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/{username}")
async def get_public_profile(username: str):
    """Public profile data by username (for shareable profile URLs)."""
    db = get_database()
    user = await db.users.find_one({"username": username.strip().lower()})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "username": user.get("username"),
        "name": user.get("name"),
        "picture": user.get("picture"),
        "bio": user.get("bio"),
        "website": user.get("website"),
        "created_at": user.get("created_at"),
    }
