from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import SessionLocal
from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from app.services.order_service import create_order, get_order, mark_order_paid,get_orders
from app.models.order_item import OrderItem

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=OrderResponse)
def create(order: OrderCreate, db: Session = Depends(get_db)):
    return create_order(db, order)

@router.get("/{order_id}", response_model=OrderResponse)
def read(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/pay")
def pay(order_id: int, db: Session = Depends(get_db)):
    order = mark_order_paid(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order marked as PAID"}

@router.get("/", response_model=List[OrderResponse])
def list_orders(db: Session = Depends(get_db)):
    return get_orders(db)

@router.get("/{order_id}/items", response_model=List[OrderItemResponse])
def get_order_items(order_id: int, db: Session = Depends(get_db)):
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    if items is None:
        raise HTTPException(status_code=404, detail="Order items not found")
    return items