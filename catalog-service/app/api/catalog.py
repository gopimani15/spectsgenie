
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.product import ProductCreate, ProductResponse
from app.services.catalog_service import (
    create_product, get_product, list_products, deactivate_product, update_product, search_products
)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/products", response_model=ProductResponse)
def create(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db, product)

@router.get("/products/{product_id}", response_model=ProductResponse)
def read(product_id: int, db: Session = Depends(get_db)):
    product = get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/products", response_model=list[ProductResponse])
def list_all(db: Session = Depends(get_db)):
    return list_products(db)

@router.delete("/products/{product_id}")
def deactivate(product_id: int, db: Session = Depends(get_db)):
    product = deactivate_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deactivated"}

@router.put("/products/{product_id}", response_model=ProductResponse)
def update(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    updated_product = update_product(db, product_id, product.dict())
    if not updated_product:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.get("/products/search", response_model=list[ProductResponse])
def search(q: str, db: Session = Depends(get_db)):
    return search_products(db, q)
