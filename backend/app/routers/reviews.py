from typing import List
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from .. import schemas, auth
from ..database import get_database
from ..models import ReviewDB

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/restaurant/{restaurant_id}", response_model=List[schemas.Review])
async def get_restaurant_reviews(restaurant_id: str):
    """Get all reviews for a restaurant"""
    db = get_database()
    reviews = await db.reviews.find({"restaurant_id": restaurant_id}).to_list(length=100)
    
    result = []
    for review in reviews:
        user = await db.users.find_one({"_id": ObjectId(review["user_id"])})
        result.append({
            "id": str(review["_id"]),
            "user_id": review["user_id"],
            "restaurant_id": review["restaurant_id"],
            "rating": review["rating"],
            "text": review["text"],
            "created_at": review["created_at"],
            "user_name": user["name"] if user else "Unknown",
            "user_avatar": user.get("picture") if user else None
        })
    
    return result


@router.get("/user/me", response_model=List[schemas.Review])
async def get_my_reviews(current_user: dict = Depends(auth.get_current_user)):
    """Get current user's reviews"""
    db = get_database()
    reviews = await db.reviews.find(
        {"user_id": str(current_user["_id"])}
    ).to_list(length=100)
    
    result = []
    for review in reviews:
        result.append({
            "id": str(review["_id"]),
            "user_id": review["user_id"],
            "restaurant_id": review["restaurant_id"],
            "rating": review["rating"],
            "text": review["text"],
            "created_at": review["created_at"],
            "user_name": current_user["name"],
            "user_avatar": current_user.get("picture")
        })
    
    return result


@router.post("/", response_model=schemas.Review)
async def create_review(
    review: schemas.ReviewCreate,
    current_user: dict = Depends(auth.get_current_user)
):
    """Create a new review"""
    db = get_database()
    
    # Check if restaurant exists
    restaurant = await db.restaurants.find_one({"_id": ObjectId(review.restaurant_id)})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    # Check if user already reviewed this restaurant
    existing_review = await db.reviews.find_one({
        "user_id": str(current_user["_id"]),
        "restaurant_id": review.restaurant_id
    })
    
    if existing_review:
        raise HTTPException(
            status_code=400,
            detail="You have already reviewed this restaurant"
        )
    
    # Create review
    review_data = ReviewDB(
        user_id=str(current_user["_id"]),
        **review.dict()
    )
    
    result = await db.reviews.insert_one(
        review_data.dict(by_alias=True, exclude={"id"})
    )
    
    # Update restaurant rating
    reviews = await db.reviews.find({"restaurant_id": review.restaurant_id}).to_list(length=1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0
    
    await db.restaurants.update_one(
        {"_id": ObjectId(review.restaurant_id)},
        {"$set": {"rating": round(avg_rating, 1)}}
    )
    
    created_review = await db.reviews.find_one({"_id": result.inserted_id})
    
    return {
        "id": str(created_review["_id"]),
        "user_id": created_review["user_id"],
        "restaurant_id": created_review["restaurant_id"],
        "rating": created_review["rating"],
        "text": created_review["text"],
        "created_at": created_review["created_at"],
        "user_name": current_user["name"],
        "user_avatar": current_user.get("picture")
    }


@router.delete("/{review_id}")
async def delete_review(
    review_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Delete a review"""
    db = get_database()
    
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    if review["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    
    restaurant_id = review["restaurant_id"]
    await db.reviews.delete_one({"_id": ObjectId(review_id)})
    
    # Update restaurant rating
    reviews = await db.reviews.find({"restaurant_id": restaurant_id}).to_list(length=1000)
    avg_rating = sum(r["rating"] for r in reviews) / len(reviews) if reviews else 0.0
    
    await db.restaurants.update_one(
        {"_id": ObjectId(restaurant_id)},
        {"$set": {"rating": round(avg_rating, 1)}}
    )
    
    return {"message": "Review deleted successfully"}
