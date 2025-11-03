from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    picture: Optional[str] = None


class UserCreate(UserBase):
    google_id: str


class UserSignup(BaseModel):
    google_token: str
    username: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    phone: Optional[str] = None
    name: Optional[str] = None


class User(UserBase):
    id: str
    username: Optional[str]
    bio: Optional[str]
    website: Optional[str]
    phone: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Restaurant Schemas
class MenuItemBase(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    image: Optional[str] = None
    available: bool = True


class MenuItemCreate(MenuItemBase):
    pass


class MenuItem(MenuItemBase):
    id: str
    restaurant_id: str

    class Config:
        from_attributes = True


class RestaurantBase(BaseModel):
    name: str
    cuisine: str
    delivery_fee: float
    eta_mins: int
    image: str
    description: Optional[str] = None


class RestaurantCreate(RestaurantBase):
    pass


class Restaurant(RestaurantBase):
    id: str
    rating: float
    created_at: datetime
    menu_items: List[MenuItem] = []

    class Config:
        from_attributes = True


# Reel Schemas
class ReelBase(BaseModel):
    title: str
    restaurant_id: Optional[str] = None


class ReelCreate(ReelBase):
    video_url: str
    thumbnail_url: Optional[str] = None


class Reel(ReelBase):
    id: str
    user_id: str
    video_url: str
    thumbnail_url: Optional[str]
    created_at: datetime
    likes: int = 0
    user_name: Optional[str] = None
    user_username: Optional[str] = None
    user_picture: Optional[str] = None

    class Config:
        from_attributes = True


# Story Schemas
class StoryCreate(BaseModel):
    image_url: str


class Story(BaseModel):
    id: str
    user_id: str
    image_url: str
    created_at: datetime
    expires_at: datetime
    user_name: Optional[str] = None
    user_username: Optional[str] = None
    user_picture: Optional[str] = None

    class Config:
        from_attributes = True


# Review Schemas
class ReviewBase(BaseModel):
    rating: int
    text: str


class ReviewCreate(ReviewBase):
    restaurant_id: str


class Review(ReviewBase):
    id: str
    user_id: str
    restaurant_id: str
    created_at: datetime
    user_name: Optional[str] = None
    user_avatar: Optional[str] = None

    class Config:
        from_attributes = True


# Order Schemas
class OrderItemBase(BaseModel):
    menu_item_id: str
    name: str
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: str

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    total: float
    eta_mins: int
    address: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: str
    user_id: str
    status: str
    created_at: datetime
    items: List[OrderItem] = []

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
    is_new_user: bool = False


class GoogleAuthRequest(BaseModel):
    token: str


class UsernameCheckRequest(BaseModel):
    username: str


class UsernameCheckResponse(BaseModel):
    available: bool
    suggestions: List[str] = []
