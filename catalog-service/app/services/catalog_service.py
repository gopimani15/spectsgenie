
from sqlalchemy.orm import Session
from app.models.product import Product
from app.core.kafka_producer import publish_event


def create_product(db, product):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    publish_event(
        "PRODUCT_UPDATED",
        {
            "product_id": db_product.product_id,
            "store_id": 1,  # or global
            "brand": db_product.brand,
            "model": db_product.model,
            "price": float(db_product.base_price)
        }
    )

    return db_product

def get_product(db: Session, product_id: int):
    return db.query(Product).filter(Product.product_id == product_id).first()

def list_products(db: Session):
    return db.query(Product).filter(Product.is_active == True).all()

def deactivate_product(db: Session, product_id: int):
    product = get_product(db, product_id)
    if product:
        product.is_active = False
        db.commit()
    return product
