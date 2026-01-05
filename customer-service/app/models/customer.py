from sqlalchemy import Column, BigInteger, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.core.database import Base

class Customer(Base):
    __tablename__ = "customer"

    customer_id = Column(BigInteger, primary_key=True, index=True)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    name = Column(String(100))
    email = Column(String(100))
    gender = Column(String(10))
    total_visits = Column(BigInteger, default=0)
    total_spent = Column(BigInteger, default=0)
    last_visit = Column(DateTime, nullable=True)
    is_vip = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
