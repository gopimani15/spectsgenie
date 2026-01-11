from sqlalchemy import Column, Integer, String, Numeric, JSON
from app.core.database import Base

class OrderReadModel(Base):
    __tablename__ = "order_read_model"
    order_id = Column(Integer, primary_key=True)
    store_id = Column(Integer)
    customer_id = Column(Integer)
    order_status = Column(String)
    total_amount = Column(Numeric)
    customer_name = Column(String)
    store_name = Column(String)
    items = Column(JSON)  # List of items as JSON
