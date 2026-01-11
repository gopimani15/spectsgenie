from pydantic import BaseModel
from decimal import Decimal
from typing import List

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: Decimal

class OrderCreate(BaseModel):
    store_id: int
    customer_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    order_item_id: int
    order_id: int
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    order_id: int
    store_id: int
    customer_id: int
    order_status: str
    total_amount: Decimal

    class Config:
        from_attributes = True
