from app.models.stock import Stock
from app.core.database import SessionLocal

def create_stock(data):
    db = SessionLocal()
    stock = Stock(**data)
    db.add(stock)
    db.commit()
    db.refresh(stock)
    db.close()
    return stock

def get_stock(stock_id):
    db = SessionLocal()
    stock = db.query(Stock).filter(Stock.id == stock_id).first()
    db.close()
    return stock

def list_stocks():
    db = SessionLocal()
    stocks = db.query(Stock).all()
    db.close()
    return stocks
