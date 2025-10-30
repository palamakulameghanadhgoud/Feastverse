from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId


class PyObjectId(ObjectId):
    """Custom type for MongoDB ObjectId"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class MongoBaseModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


# User Model
class UserDB(MongoBaseModel):
    google_id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    followed_restaurants: List[str] = []
    subscribed_restaurants: List[str] = []
    liked_reels: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


# Restaurant Model
class MenuItemDB(BaseModel):
    id: str
    name: str
    price: float
    description: Optional[str] = None
    image: Optional[str] = None
    available: bool = True


class RestaurantDB(MongoBaseModel):
    name: str
    cuisine: str
    rating: float = 0.0
    delivery_fee: float
    eta_mins: int
    image: str
    description: Optional[str] = None
    menu_items: List[MenuItemDB] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


# Reel Model
class ReelDB(MongoBaseModel):
    user_id: str
    restaurant_id: Optional[str] = None
    title: str
    video_url: str
    thumbnail_url: Optional[str] = None
    likes_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Story Model
class StoryDB(MongoBaseModel):
    user_id: str
    image_url: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Review Model
class ReviewDB(MongoBaseModel):
    user_id: str
    restaurant_id: str
    rating: int
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None


# Order Model
class OrderItemDB(BaseModel):
    menu_item_id: str
    name: str
    quantity: int
    price: float


class OrderDB(MongoBaseModel):
    user_id: str
    restaurant_id: str
    items: List[OrderItemDB]
    total: float
    eta_mins: int
    status: str = "preparing"  # preparing, pickup, on the way, delivered
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
