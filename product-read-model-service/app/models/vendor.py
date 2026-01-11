from sqlalchemy import Column, BigInteger, String
from app.core.database import Base

class Vendor(Base):
    __tablename__ = "vendor"

    id = Column(BigInteger, primary_key=True)
    name = Column(String(100), nullable=False)
    contact = Column(String(100))
    address = Column(String(255))
