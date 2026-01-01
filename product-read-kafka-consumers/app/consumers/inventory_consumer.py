import logging
import sys
import time
from kafka import KafkaConsumer  # type: ignore
from kafka.errors import KafkaError  # type: ignore
import json
from app.core.database import SessionLocal
from app.models.product_inventory_view import ProductInventoryView
from app.core.config import INVENTORY_TOPIC, KAFKA_BOOTSTRAP_SERVERS

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def create_consumer():
    """Create and return a Kafka consumer with error handling"""
    try:
        logger.info(f"Connecting to Kafka at {KAFKA_BOOTSTRAP_SERVERS}")
        logger.info(f"Subscribing to topic: {INVENTORY_TOPIC}")
        
        consumer = KafkaConsumer(
            INVENTORY_TOPIC,
            bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
            value_deserializer=lambda v: json.loads(v.decode("utf-8")),
            auto_offset_reset="earliest",
            enable_auto_commit=True,
            auto_commit_interval_ms=5000,
            group_id="inventory-consumer-group",
            session_timeout_ms=30000,
            heartbeat_interval_ms=10000,
            max_poll_records=10,
            max_poll_interval_ms=300000
        )
        
        logger.info("Successfully connected to Kafka")
        return consumer
    except Exception as e:
        logger.error(f"Failed to create Kafka consumer: {e}", exc_info=True)
        raise

def process_inventory_update(event):
    """Process an inventory update event"""
    db = None
    try:
        logger.info(f"Processing inventory update event: {event}")
        
        # Validate event structure
        required_fields = ["product_id", "store_id", "available_quantity"]
        for field in required_fields:
            if field not in event:
                raise ValueError(f"Missing required field: {field}")
        
        product_id = event["product_id"]
        store_id = event["store_id"]
        available_quantity = event["available_quantity"]
        
        db = SessionLocal()
        
        record = db.query(ProductInventoryView).filter(
            ProductInventoryView.product_id == product_id,
            ProductInventoryView.store_id == store_id
        ).first()

        if record:
            logger.info(f"Updating existing record - Product: {product_id}, Store: {store_id}, Quantity: {available_quantity}")
            record.available_quantity = available_quantity
            db.commit()
            logger.info(f"Successfully updated inventory for product {product_id} at store {store_id}")
        else:
            logger.warning(f"No existing record found for product {product_id} at store {store_id}. Skipping update.")
            
    except ValueError as e:
        logger.error(f"Invalid event data: {e}")
        raise
    except Exception as e:
        logger.error(f"Error processing inventory update: {e}", exc_info=True)
        if db:
            db.rollback()
        raise
    finally:
        if db:
            db.close()

def main():
    """Main consumer loop"""
    consumer = None
    retry_count = 0
    max_retries = 5
    
    try:
        while retry_count < max_retries:
            try:
                consumer = create_consumer()
                logger.info("Starting inventory consumer loop...")
                retry_count = 0  # Reset retry count on successful connection
                
                logger.info("Entering message consumption loop...")
                for msg in consumer:
                    try:
                        logger.info(f"Received message from topic {msg.topic}, partition {msg.partition}, offset {msg.offset}")
                        event = msg.value
                        
                        if event is None:
                            logger.warning("Received None event, skipping")
                            continue
                        
                        process_inventory_update(event)
                        
                    except json.JSONDecodeError as e:
                        logger.error(f"Failed to decode message: {e}")
                        continue
                    except ValueError as e:
                        logger.error(f"Invalid event format: {e}")
                        continue
                    except Exception as e:
                        logger.error(f"Unexpected error processing message: {e}", exc_info=True)
                        continue
                
                # If we exit the for loop, log it
                logger.warning("Exited message consumption loop unexpectedly")
            
            except KafkaError as e:
                retry_count += 1
                logger.error(f"Kafka error (attempt {retry_count}/{max_retries}): {e}", exc_info=True)
                if consumer:
                    try:
                        consumer.close()
                    except:
                        pass
                    consumer = None
                
                if retry_count < max_retries:
                    wait_time = min(2 ** retry_count, 30)  # Exponential backoff, max 30 seconds
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    logger.error("Max retries reached. Exiting.")
                    break
                    
            except KeyboardInterrupt:
                logger.info("Received interrupt signal, shutting down...")
                break
            except Exception as e:
                retry_count += 1
                logger.error(f"Fatal error in consumer (attempt {retry_count}/{max_retries}): {e}", exc_info=True)
                if consumer:
                    try:
                        consumer.close()
                    except:
                        pass
                    consumer = None
                
                if retry_count < max_retries:
                    wait_time = min(2 ** retry_count, 30)
                    logger.info(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    logger.error("Max retries reached. Exiting.")
                    break
    finally:
        if consumer:
            logger.info("Closing consumer...")
            try:
                consumer.close()
            except:
                pass
        logger.info("Inventory consumer stopped")

if __name__ == "__main__":
    main()
