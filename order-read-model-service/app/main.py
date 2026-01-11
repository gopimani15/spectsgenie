from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import OrderReadModel
from app.core.database import get_db

app = FastAPI(title="Order Read Model Service")

@app.get("/orders/")
def list_orders(db: Session = Depends(get_db)):
    return db.query(OrderReadModel).all()

@app.get("/orders/{order_id}")
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderReadModel).filter(OrderReadModel.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
