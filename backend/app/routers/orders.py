from typing import List
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson import ObjectId

from .. import schemas, auth
from ..database import get_database
from ..models import OrderDB, OrderItemDB

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=List[schemas.Order])
async def get_my_orders(current_user: dict = Depends(auth.get_current_user)):
    """Get current user's orders"""
    db = get_database()
    orders = await db.orders.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).to_list(length=100)
    
    return [
        {
            "id": str(order["_id"]),
            "user_id": order["user_id"],
            "total": order["total"],
            "eta_mins": order["eta_mins"],
            "status": order["status"],
            "address": order.get("address"),
            "created_at": order["created_at"],
            "items": [
                {
                    "id": idx,
                    "order_id": str(order["_id"]),
                    "menu_item_id": item["menu_item_id"],
                    "quantity": item["quantity"],
                    "price": item["price"]
                }
                for idx, item in enumerate(order["items"])
            ]
        }
        for order in orders
    ]


@router.get("/{order_id}", response_model=schemas.Order)
async def get_order(
    order_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Get a specific order"""
    db = get_database()
    order = await db.orders.find_one({
        "_id": ObjectId(order_id),
        "user_id": str(current_user["_id"])
    })
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": str(order["_id"]),
        "user_id": order["user_id"],
        "total": order["total"],
        "eta_mins": order["eta_mins"],
        "status": order["status"],
        "address": order.get("address"),
        "created_at": order["created_at"],
        "items": [
            {
                "id": idx,
                "order_id": str(order["_id"]),
                "menu_item_id": item["menu_item_id"],
                "quantity": item["quantity"],
                "price": item["price"]
            }
            for idx, item in enumerate(order["items"])
        ]
    }


@router.post("/", response_model=schemas.Order)
async def create_order(
    order: schemas.OrderCreate,
    current_user: dict = Depends(auth.get_current_user)
):
    """Create a new order"""
    db = get_database()
    
    # Verify all menu items exist
    for item in order.items:
        # This is a simplified check - in production you'd verify the menu item exists
        pass
    
    # Create order
    order_data = OrderDB(
        user_id=str(current_user["_id"]),
        restaurant_id="",  # Can be extracted from menu items
        items=[OrderItemDB(**item.dict()) for item in order.items],
        total=order.total,
        eta_mins=order.eta_mins,
        address=order.address,
        status="preparing"
    )
    
    result = await db.orders.insert_one(
        order_data.dict(by_alias=True, exclude={"id"})
    )
    
    created_order = await db.orders.find_one({"_id": result.inserted_id})
    
    return {
        "id": str(created_order["_id"]),
        "user_id": created_order["user_id"],
        "total": created_order["total"],
        "eta_mins": created_order["eta_mins"],
        "status": created_order["status"],
        "address": created_order.get("address"),
        "created_at": created_order["created_at"],
        "items": [
            {
                "id": idx,
                "order_id": str(created_order["_id"]),
                "menu_item_id": item["menu_item_id"],
                "quantity": item["quantity"],
                "price": item["price"]
            }
            for idx, item in enumerate(created_order["items"])
        ]
    }


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    current_user: dict = Depends(auth.get_current_user)
):
    """Advance order status to next stage"""
    db = get_database()
    
    order = await db.orders.find_one({
        "_id": ObjectId(order_id),
        "user_id": str(current_user["_id"])
    })
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Status progression
    status_flow = {
        "preparing": "pickup",
        "pickup": "on the way",
        "on the way": "delivered"
    }
    
    current_status = order["status"]
    if current_status in status_flow:
        new_status = status_flow[current_status]
        await db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
    
    updated_order = await db.orders.find_one({"_id": ObjectId(order_id)})
    
    return {
        "id": str(updated_order["_id"]),
        "user_id": updated_order["user_id"],
        "total": updated_order["total"],
        "eta_mins": updated_order["eta_mins"],
        "status": updated_order["status"],
        "address": updated_order.get("address"),
        "created_at": updated_order["created_at"],
        "items": [
            {
                "id": idx,
                "order_id": str(updated_order["_id"]),
                "menu_item_id": item["menu_item_id"],
                "quantity": item["quantity"],
                "price": item["price"]
            }
            for idx, item in enumerate(updated_order["items"])
        ]
    }
