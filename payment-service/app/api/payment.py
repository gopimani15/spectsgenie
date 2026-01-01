
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services.payment_service import create_payment, refund_payment

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=PaymentResponse)
def pay(payment: PaymentCreate, db: Session = Depends(get_db)):
    return create_payment(db, payment)

@router.post("/{payment_id}/refund")
def refund(payment_id: int, db: Session = Depends(get_db)):
    payment = refund_payment(db, payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment refunded"}
