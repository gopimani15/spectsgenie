
from sqlalchemy import Column, BigInteger, String, Numeric, Boolean
from app.core.database import Base

class Product(Base):
    __tablename__ = "products"

    product_id = Column(BigInteger, primary_key=True, index=True)
    product_type = Column(String(20))  # FRAME / LENS / ACCESSORY
    brand = Column(String(50))
    model = Column(String(50))
    base_price = Column(Numeric(10,2))
    is_active = Column(Boolean, default=True)
