
from sqlalchemy import Column, BigInteger, String, Numeric, Boolean
from app.core.database import Base

class Product(Base):
    __tablename__ = "product"

    product_id = Column(BigInteger, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True)
    barcode = Column(String(50), unique=True, index=True, nullable=True)
    product_type = Column(String(20))  # FRAME / LENS / ACCESSORY
    brand = Column(String(50))
    model = Column(String(50))
    base_price = Column(Numeric(10,2))
    is_active = Column(Boolean, default=True)

    @property
    def price(self):
        return self.base_price

    @price.setter
    def price(self, value):
        self.base_price = value
