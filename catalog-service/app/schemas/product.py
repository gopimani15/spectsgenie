
from pydantic import BaseModel
from decimal import Decimal

from typing import Optional

class ProductCreate(BaseModel):
    sku: Optional[str] = None
    barcode: Optional[str] = None
    product_type: Optional[str] = "FRAME"
    brand: str
    model: str
    price: Decimal
    # Allow extra fields for "same model" updates
    product_id: Optional[int] = None
    store_id: Optional[int] = None
    available_quantity: Optional[int] = None

class ProductResponse(BaseModel):
    product_id: int
    sku: Optional[str] = None
    barcode: Optional[str] = None
    product_type: str
    brand: str
    model: str
    price: Decimal
    is_active: bool

    class Config:
        from_attributes = True
