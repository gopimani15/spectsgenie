
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.product_view_service import get_products_by_store

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/store/{store_id}")
def products(store_id: int, db: Session = Depends(get_db)):
    return get_products_by_store(db, store_id)
