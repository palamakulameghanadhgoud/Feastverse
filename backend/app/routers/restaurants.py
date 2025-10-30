from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from bson import ObjectId
import uuid

from .. import schemas, auth
from ..database import get_database
from ..models import RestaurantDB, MenuItemDB

router = APIRouter(prefix="/restaurants", tags=["restaurants"])


@router.get("/", response_model=List[schemas.Restaurant])
async def get_restaurants(skip: int = 0, limit: int = 100):
    """Get all restaurants"""
    db = get_database()
    restaurants = await db.restaurants.find().skip(skip).limit(limit).to_list(length=limit)
    
    return [
        {
            "id": str(r["_id"]),
            "name": r["name"],
            "cuisine": r["cuisine"],
            "rating": r["rating"],
            "delivery_fee": r["delivery_fee"],
            "eta_mins": r["eta_mins"],
            "image": r["image"],
            "description": r.get("description"),
            "created_at": r["created_at"],
            "menu_items": [
                {
                    "id": item["id"],
                    "name": item["name"],
                    "price": item["price"],
                    "description": item.get("description"),
                    "image": item.get("image"),
                    "available": item.get("available", True),
                    "restaurant_id": str(r["_id"])
                }
                for item in r.get("menu_items", [])
            ]
        }
        for r in restaurants
    ]


@router.get("/{restaurant_id}", response_model=schemas.Restaurant)
async def get_restaurant(restaurant_id: str):
    """Get a specific restaurant by ID"""
    db = get_database()
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return {
        "id": str(restaurant["_id"]),
        "name": restaurant["name"],
        "cuisine": restaurant["cuisine"],
        "rating": restaurant["rating"],
        "delivery_fee": restaurant["delivery_fee"],
        "eta_mins": restaurant["eta_mins"],
        "image": restaurant["image"],
        "description": restaurant.get("description"),
        "created_at": restaurant["created_at"],
        "menu_items": [
            {
                "id": item["id"],
                "name": item["name"],
                "price": item["price"],
                "description": item.get("description"),
                "image": item.get("image"),
                "available": item.get("available", True),
                "restaurant_id": str(restaurant["_id"])
            }
            for item in restaurant.get("menu_items", [])
        ]
    }


@router.post("/", response_model=schemas.Restaurant, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    restaurant: schemas.RestaurantCreate,
    current_user: dict = Depends(auth.get_current_user)
):
    """Create a new restaurant"""
    db = get_database()
    
    restaurant_data = RestaurantDB(**restaurant.dict())
    result = await db.restaurants.insert_one(
        restaurant_data.dict(by_alias=True, exclude={"id"})
    )
    
    created_restaurant = await db.restaurants.find_one({"_id": result.inserted_id})
    
    return {
        "id": str(created_restaurant["_id"]),
        "name": created_restaurant["name"],
        "cuisine": created_restaurant["cuisine"],
        "rating": created_restaurant["rating"],
        "delivery_fee": created_restaurant["delivery_fee"],
        "eta_mins": created_restaurant["eta_mins"],
        "image": created_restaurant["image"],
        "description": created_restaurant.get("description"),
        "created_at": created_restaurant["created_at"],
        "menu_items": []
    }


@router.post("/{restaurant_id}/menu", response_model=schemas.MenuItem)
async def add_menu_item(
    restaurant_id: str,
    menu_item: schemas.MenuItemCreate,
    current_user: dict = Depends(auth.get_current_user)
):
    """Add menu item to restaurant"""
    db = get_database()
    
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    menu_item_data = MenuItemDB(
        id=str(uuid.uuid4()),
        **menu_item.dict()
    )
    
    await db.restaurants.update_one(
        {"_id": ObjectId(restaurant_id)},
        {"$push": {"menu_items": menu_item_data.dict()}}
    )
    
    return {
        "id": menu_item_data.id,
        "restaurant_id": restaurant_id,
        **menu_item.dict()
    }


@router.post("/{restaurant_id}/follow")
async def follow_restaurant(
    restaurant_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Follow a restaurant"""
    db = get_database()
    
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$addToSet": {"followed_restaurants": restaurant_id}}
    )
    
    return {"message": "Restaurant followed successfully"}


@router.delete("/{restaurant_id}/follow")
async def unfollow_restaurant(
    restaurant_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Unfollow a restaurant"""
    db = get_database()
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$pull": {"followed_restaurants": restaurant_id}}
    )
    
    return {"message": "Restaurant unfollowed successfully"}


@router.post("/{restaurant_id}/subscribe")
async def subscribe_restaurant(
    restaurant_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Subscribe to a restaurant"""
    db = get_database()
    
    restaurant = await db.restaurants.find_one({"_id": ObjectId(restaurant_id)})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$addToSet": {"subscribed_restaurants": restaurant_id}}
    )
    
    return {"message": "Subscribed successfully"}


@router.delete("/{restaurant_id}/subscribe")
async def unsubscribe_restaurant(
    restaurant_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Unsubscribe from a restaurant"""
    db = get_database()
    
    await db.users.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$pull": {"subscribed_restaurants": restaurant_id}}
    )
    
    return {"message": "Unsubscribed successfully"}
