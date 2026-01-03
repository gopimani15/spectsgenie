from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database import Base

class Store(Base):
    __tablename__ = "store"

    store_id = Column(Integer, primary_key=True, index=True)
    store_code = Column(String, index=True)
    store_name = Column(String, index=True)
    city = Column(String)
    state = Column(String)
    store_type = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
