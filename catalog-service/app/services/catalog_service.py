
from sqlalchemy.orm import Session
from app.models.product import Product
from app.core.kafka_producer import publish_event


import random
import string

def generate_sku(brand: str, model: str, product_type: str) -> str:
    # Clean inputs: remove spaces, take first 3 chars, uppercase
    b = "".join(e for e in brand if e.isalnum())[:3].upper()
    m = "".join(e for e in model if e.isalnum())[:3].upper()
    t = "".join(e for e in product_type if e.isalnum())[:3].upper()
    
    # Generate random suffix
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    
    return f"{b}-{m}-{t}-{suffix}"

def create_product(db, product):
    product_data = product.dict()
    
    # Generate SKU if not provided
    if not product_data.get("sku"):
        product_data["sku"] = generate_sku(
            product_data["brand"], 
            product_data["model"], 
            product_data["product_type"]
        )
    
    db_product = Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    publish_event(
        "PRODUCT_UPDATED",
        {
            "product_id": db_product.product_id,
            "store_id": 1,  # or global
            "sku": db_product.sku,
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
