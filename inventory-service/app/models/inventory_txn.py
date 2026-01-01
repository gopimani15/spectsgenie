from enum import Enum
from sqlalchemy import Column, BigInteger, Integer, String
from app.core.database import Base

class TransactionType(str, Enum):
    SALE = "SALE"
    RETURN = "RETURN"
    TRANSFER_IN = "TRANSFER_IN"
    TRANSFER_OUT = "TRANSFER_OUT"
    # Note: Database constraint allows: SALE, RETURN, TRANSFER_IN, TRANSFER_OUT
    # If you need additional types, update the database constraint first

class InventoryTxn(Base):
    __tablename__ = "inventory_txn"

    txn_id = Column(BigInteger, primary_key=True, index=True)
    store_id = Column(BigInteger)
    product_id = Column(BigInteger)
    txn_type = Column(String(30), nullable=False)  # Constrained by DB CHECK: SALE, RETURN, TRANSFER_IN, TRANSFER_OUT
    quantity = Column(Integer)
