
from sqlalchemy import Column, BigInteger, String, ForeignKey
from app.core.database import Base

class ProductAttribute(Base):
    __tablename__ = "product_attributes"

    attribute_id = Column(BigInteger, primary_key=True)
    product_id = Column(BigInteger, ForeignKey("products.product_id"))
    attr_name = Column(String(50))
    attr_value = Column(String(50))
