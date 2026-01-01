
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import create_order, get_order, mark_order_paid

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
