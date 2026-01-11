from sqlalchemy import Column, BigInteger, Integer, ForeignKey
from app.core.database import Base

class Stock(Base):
    __tablename__ = "stock"

    id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, nullable=False)
    store_id = Column(BigInteger, nullable=False)
    vendor_id = Column(BigInteger, ForeignKey("vendor.id"))
    quantity = Column(Integer, nullable=False)
