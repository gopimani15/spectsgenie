import requests
from sqlalchemy.orm import Session
from decimal import Decimal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.core.kafka_producer import publish_order_event

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
    # Fetch customer and store names for event enrichment
    customer_name = None
    store_name = None
    try:
        cust_resp = requests.get(f"http://customer-service:8000/customers/{db_order.customer_id}", timeout=2)
        print(f"customer-service response: status={cust_resp.status_code}, body={cust_resp.text}")
        if cust_resp.status_code == 200:
            customer_name = cust_resp.json().get("name")
    except Exception as e:
        print(f"customer-service request failed: {e}")
        customer_name = None
    try:
        store_resp = requests.get(f"http://store-service:8000/stores/{db_order.store_id}", timeout=2)
        print(f"store-service response: status={store_resp.status_code}, body={store_resp.text}")
        if store_resp.status_code == 200:
            store_name = store_resp.json().get("store_name")
    except Exception as e:
        print(f"store-service request failed: {e}")
        store_name = None
    # Publish order created event
    event = {
        "order_id": db_order.order_id,
        "store_id": db_order.store_id,
        "customer_id": db_order.customer_id,
        "order_status": db_order.order_status,
        "total_amount": float(db_order.total_amount),
        "customer_name": customer_name,
        "store_name": store_name,
        "items": [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": float(item.price)
            } for item in db.query(OrderItem).filter(OrderItem.order_id == db_order.order_id).all()
        ]
    }
    publish_order_event(event)
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
        # Fetch customer and store names for event enrichment
        customer_name = None
        store_name = None
        try:
            cust_resp = requests.get(f"http://customer-service:8000/customers/{order.customer_id}", timeout=2)
            if cust_resp.status_code == 200:
                customer_name = cust_resp.json().get("name")
        except Exception:
            customer_name = None
        try:
            store_resp = requests.get(f"http://store-service:8000/stores/{order.store_id}", timeout=2)
            print(f"store-service response: status={store_resp.status_code}, body={store_resp.text}")
            if store_resp.status_code == 200:
                store_name = store_resp.json().get("store_name")
        except Exception as e:
            print(f"store-service request failed: {e}")
            store_name = None
        # Publish order paid event
        event = {
            "order_id": order.order_id,
            "store_id": order.store_id,
            "customer_id": order.customer_id,
            "order_status": order.order_status,
            "total_amount": float(order.total_amount),
            "customer_name": customer_name,
            "store_name": store_name,
            "items": [
                {
                    "product_id": item.product_id,
                    "quantity": item.quantity,
                    "price": float(item.price)
                } for item in db.query(OrderItem).filter(OrderItem.order_id == order.order_id).all()
            ]
        }
        publish_order_event(event)
    return order
