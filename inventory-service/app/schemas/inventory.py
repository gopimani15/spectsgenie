
from pydantic import BaseModel

class InventoryResponse(BaseModel):
    store_id: int
    product_id: int
    quantity: int

    class Config:
        orm_mode = True
