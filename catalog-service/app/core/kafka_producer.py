from kafka import KafkaProducer
from kafka.errors import KafkaError
import json
import logging
from app.core.config import KAFKA_BOOTSTRAP_SERVERS

logger = logging.getLogger(__name__)
_producer = None

def get_producer():
    global _producer
    if _producer is None:
        try:
            _producer = KafkaProducer(
                bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
                api_version=(0, 10, 1)
            )
        except Exception as e:
            logger.warning(f"Failed to initialize Kafka producer: {e}")
            _producer = None
    return _producer

def publish_event(topic: str, payload: dict):
    try:
        producer = get_producer()
        if producer is None:
            logger.warning(f"Kafka producer not available, skipping event publish for topic: {topic}")
            return
        producer.send(topic, payload)
        producer.flush()
    except Exception as e:
        logger.error(f"Failed to publish event to topic {topic}: {e}")
