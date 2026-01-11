import json
from sqlalchemy.orm import Session
from kafka import KafkaConsumer
from app.core.database import SessionLocal
from app.models import OrderReadModel

KAFKA_BOOTSTRAP_SERVERS = "kafka:9092"
ORDER_TOPIC = "ORDER_EVENTS"

# Helper to upsert order read model
def upsert_order_read_model(order_data):
    db: Session = SessionLocal()
    try:
        order_id = order_data["order_id"]
        order = db.query(OrderReadModel).filter(OrderReadModel.order_id == order_id).first()
        if not order:
            order = OrderReadModel(order_id=order_id)
            db.add(order)
        # Update fields
        order.store_id = order_data.get("store_id")
        order.customer_id = order_data.get("customer_id")
        order.order_status = order_data.get("order_status")
        order.total_amount = order_data.get("total_amount")
        order.customer_name = order_data.get("customer_name")
        order.store_name = order_data.get("store_name")
        order.items = order_data.get("items", [])
        db.commit()
    finally:
        db.close()

# Kafka consumer loop
def consume_order_events():
    consumer = KafkaConsumer(
        ORDER_TOPIC,
        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        auto_offset_reset="earliest",
        group_id="order-read-model-consumer"
    )
    print("OrderReadModel Kafka consumer started...")
    for msg in consumer:
        event = msg.value
        # Expect event to be a dict with all required fields
        upsert_order_read_model(event)
        print(f"Processed order event: {event.get('order_id')}")
        import logging
        logging.basicConfig(level=logging.INFO)
        logging.info(f"Order event: {json.dumps(event)}")

if __name__ == "__main__":
    consume_order_events()
