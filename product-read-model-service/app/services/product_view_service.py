
from sqlalchemy.orm import Session
from app.models.product_inventory_view import ProductInventoryView

def get_products_by_store(db: Session, store_id: int):
    return (
        db.query(ProductInventoryView)
        .filter(ProductInventoryView.store_id == store_id)
        .all()
    )
