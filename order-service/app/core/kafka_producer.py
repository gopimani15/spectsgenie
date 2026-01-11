from kafka import KafkaProducer
import json
import os

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
ORDER_TOPIC = os.getenv("ORDER_EVENTS_TOPIC", "ORDER_EVENTS")

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def publish_order_event(event: dict):
    producer.send(ORDER_TOPIC, event)
    producer.flush()
