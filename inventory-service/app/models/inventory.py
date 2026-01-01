
from sqlalchemy import Column, BigInteger, Integer
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    store_id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, primary_key=True)
    quantity = Column(Integer, nullable=False)
