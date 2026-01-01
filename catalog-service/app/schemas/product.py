
from pydantic import BaseModel
from decimal import Decimal

class ProductCreate(BaseModel):
    product_type: str
    brand: str
    model: str
    base_price: Decimal

class ProductResponse(ProductCreate):
    product_id: int
    is_active: bool

    class Config:
        orm_mode = True
