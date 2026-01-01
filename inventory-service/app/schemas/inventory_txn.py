from pydantic import BaseModel
from app.models.inventory_txn import TransactionType

class InventoryTxnCreate(BaseModel):
    store_id: int
    product_id: int
    txn_type: TransactionType
    quantity: int
