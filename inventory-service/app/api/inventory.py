
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.inventory import InventoryResponse
from app.schemas.inventory_txn import InventoryTxnCreate
from app.services.inventory_service import (
    get_inventory_by_store, create_inventory_txn
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/{store_id}", response_model=list[InventoryResponse])
def read_inventory(store_id: int, db: Session = Depends(get_db)):
    return get_inventory_by_store(db, store_id)

@router.post("/txn")
def create_txn(txn: InventoryTxnCreate, db: Session = Depends(get_db)):
    return create_inventory_txn(db, txn)
