import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/spectsgenie_catalog"
)

KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
PRODUCT_TOPIC = os.getenv("PRODUCT_TOPIC", "PRODUCT_UPDATED")
INVENTORY_TOPIC = os.getenv("INVENTORY_TOPIC", "INVENTORY_UPDATED")
