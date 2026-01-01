
from sqlalchemy import Column, BigInteger, String, Numeric
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(BigInteger, primary_key=True, index=True)
    order_id = Column(BigInteger, nullable=False)
    payment_mode = Column(String(20))  # CASH, CARD, UPI
    amount = Column(Numeric(10,2))
    payment_status = Column(String(20))  # SUCCESS, FAILED, REFUND
