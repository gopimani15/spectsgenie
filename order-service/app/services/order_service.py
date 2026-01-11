from sqlalchemy.orm import Session
from decimal import Decimal
from app.models.order import Order
from app.models.order_item import OrderItem

def create_order(db: Session, order):
    total = sum([item.price * item.quantity for item in order.items])
    db_order = Order(
        store_id=order.store_id,
        customer_id=order.customer_id,
        total_amount=Decimal(total)
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)

    db.commit()
    return db_order

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.order_id == order_id).first()

def get_orders(db: Session):
    return db.query(Order).all()

def mark_order_paid(db: Session, order_id: int):
    order = get_order(db, order_id)
    if order:
        order.order_status = "PAID"
        db.commit()
    return order
