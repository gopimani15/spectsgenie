from fastapi import APIRouter, HTTPException
from app.services.stock_service import create_stock, get_stock, list_stocks

router = APIRouter()

@router.post("/")
def create(data: dict):
    return create_stock(data)

@router.get("/{stock_id}")
def get(stock_id: int):
    stock = get_stock(stock_id)
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@router.get("/")
def list_all():
    return list_stocks()
