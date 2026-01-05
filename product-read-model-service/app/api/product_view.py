from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.services.product_view_service import get_products_by_store, get_product_by_barcode

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

@router.get("/barcode/{barcode}")
def product_by_barcode(
    barcode: str, 
    store_id: int = Query(None, description="Optional store ID to filter results"),
    db: Session = Depends(get_db)
):
    product = get_product_by_barcode(db, barcode, store_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product with barcode '{barcode}' not found")
    return product

@router.get("/search")
def search(
    q: str, 
    store_id: int = Query(None, description="Optional store ID to filter results"),
    db: Session = Depends(get_db)
):
    from app.services.product_view_service import search_products
    return search_products(db, q, store_id)
