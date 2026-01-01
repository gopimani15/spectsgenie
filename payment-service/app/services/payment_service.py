
from sqlalchemy.orm import Session
from app.models.payment import Payment

def create_payment(db: Session, payment):
    db_payment = Payment(
        order_id=payment.order_id,
        payment_mode=payment.payment_mode,
        amount=payment.amount,
        payment_status="SUCCESS"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

def refund_payment(db: Session, payment_id: int):
    payment = db.query(Payment).filter(Payment.payment_id == payment_id).first()
    if payment:
        payment.payment_status = "REFUND"
        db.commit()
    return payment
