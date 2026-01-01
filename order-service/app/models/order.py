
from sqlalchemy import Column, BigInteger, String, Numeric
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    order_id = Column(BigInteger, primary_key=True, index=True)
    store_id = Column(BigInteger, nullable=False)
    customer_id = Column(BigInteger, nullable=False)
    order_status = Column(String(30), default="CREATED")
    total_amount = Column(Numeric(10,2))
