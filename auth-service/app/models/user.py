from sqlalchemy import Column, BigInteger, String
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    role = Column(String)
