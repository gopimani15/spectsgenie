
from pydantic import BaseModel
from decimal import Decimal

class PaymentCreate(BaseModel):
    order_id: int
    payment_mode: str
    amount: Decimal

class PaymentResponse(PaymentCreate):
    payment_id: int
    payment_status: str

    class Config:
        orm_mode = True
