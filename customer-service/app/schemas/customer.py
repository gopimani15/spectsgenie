from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class CustomerBase(BaseModel):
    phone: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    gender: Optional[str] = None
    is_vip: Optional[bool] = False

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    customer_id: int
    total_visits: int
    total_spent: int
    last_visit: Optional[datetime] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
