from sqlalchemy import or_
from sqlalchemy.orm import Session
from app.models.product_inventory_view import ProductInventoryView

def get_products_by_store(db: Session, store_id: int):
    return (
        db.query(ProductInventoryView)
        .filter(ProductInventoryView.store_id == store_id)
        .all()
    )

def get_product_by_barcode(db: Session, barcode: str, store_id: int = None):
    query = db.query(ProductInventoryView).filter(ProductInventoryView.barcode == barcode)
    if store_id:
        query = query.filter(ProductInventoryView.store_id == store_id)
    return query.first()

def search_products(db: Session, query: str, store_id: int = None):
    search_filter = f"%{query}%"
    q = db.query(ProductInventoryView).filter(
        or_(
            ProductInventoryView.sku.ilike(search_filter),
            ProductInventoryView.barcode.ilike(search_filter),
            ProductInventoryView.brand.ilike(search_filter),
            ProductInventoryView.model.ilike(search_filter)
        )
    )
    if store_id:
        q = q.filter(ProductInventoryView.store_id == store_id)
    return q.all()
