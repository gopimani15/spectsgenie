from app.models.inventory import Inventory
from app.core.database import SessionLocal

def create_inventory(data):
    db = SessionLocal()
    inventory = Inventory(**data)
    db.add(inventory)
    db.commit()
    db.refresh(inventory)
    db.close()
    return inventory

def get_inventory(inventory_id):
    db = SessionLocal()
    inventory = db.query(Inventory).filter(Inventory.id == inventory_id).first()
    db.close()
    return inventory

def list_inventories():
    db = SessionLocal()
    inventories = db.query(Inventory).all()
    db.close()
    return inventories
