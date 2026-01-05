
from sqlalchemy import Column, BigInteger, String, Numeric, Integer
from app.core.database import Base

class ProductInventoryView(Base):
    __tablename__ = "product_inventory_view"

    product_id = Column(BigInteger, primary_key=True)
    store_id = Column(BigInteger, primary_key=True)
    sku = Column(String(50))
    barcode = Column(String(50))
    brand = Column(String(50))
    model = Column(String(50))
    price = Column(Numeric(10,2))
    available_quantity = Column(Integer)
