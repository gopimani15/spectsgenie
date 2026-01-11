
from sqlalchemy import Column, BigInteger, Integer, Numeric, ForeignKey
from app.core.database import Base

class OrderItem(Base):
    __tablename__ = "order_item"

    order_item_id = Column(BigInteger, primary_key=True)
    order_id = Column(BigInteger, ForeignKey("orders.order_id"))
    product_id = Column(BigInteger)
    quantity = Column(Integer)
    price = Column(Numeric(10,2))
