from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, nullable=False)
    store_id = Column(BigInteger, nullable=False)
    quantity = Column(Integer, nullable=False)
    stock_id = Column(BigInteger, ForeignKey("stock.id"))
