from sqlalchemy.orm import Session
from app.models.inventory import Inventory
from app.models.inventory_txn import InventoryTxn
from app.core.kafka_producer import publish_event


def get_inventory_by_store(db: Session, store_id: int):
    return db.query(Inventory).filter(Inventory.store_id == store_id).all()

def create_inventory_txn(db, txn):
    db_txn = InventoryTxn(**txn.dict())
    db.add(db_txn)
    db.commit()

    # fetch updated quantity
    inventory = db.query(Inventory).filter(
        Inventory.store_id == txn.store_id,
        Inventory.product_id == txn.product_id
    ).first()

    publish_event(
        "INVENTORY_UPDATED",
        {
            "product_id": txn.product_id,
            "store_id": txn.store_id,
            "available_quantity": inventory.quantity
        }
    )

    return db_txn
