from sqlalchemy import or_
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

def generate_barcode() -> str:
    """Generates a pseudo-random EAN-13 barcode."""
    # Prefix for our store (e.g., 200 for internal use)
    prefix = "200"
    # Generate random 9 digits
    body = "".join(random.choices(string.digits, k=9))
    # Combine prefix and body (12 digits)
    barcode_12 = prefix + body
    
    # Calculate checksum digit
    evensum = sum(int(barcode_12[i]) for i in range(1, 12, 2))
    oddsum = sum(int(barcode_12[i]) for i in range(0, 12, 2))
    total = evensum * 3 + oddsum
    checksum = (10 - (total % 10)) % 10
    
    return barcode_12 + str(checksum)

def create_product(db, product):
    product_data = product.dict()
    
    # Generate SKU if not provided
    if not product_data.get("sku"):
        product_data["sku"] = generate_sku(
            product_data["brand"], 
            product_data["model"], 
            product_data["product_type"]
        )
    
    # Generate Barcode if not provided
    if not product_data.get("barcode"):
        product_data["barcode"] = generate_barcode()
    
    # Map price to base_price if provided
    if "price" in product_data:
        product_data["base_price"] = product_data.pop("price")
    
    # Remove fields not in DB
    db_fields = ["sku", "barcode", "product_type", "brand", "model", "base_price", "is_active"]
    filtered_data = {k: v for k, v in product_data.items() if k in db_fields}

    db_product = Product(**filtered_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    publish_event(
        "PRODUCT_UPDATED",
        {
            "product_id": db_product.product_id,
            "store_id": product_data.get("store_id", 1),
            "sku": db_product.sku,
            "barcode": db_product.barcode,
            "brand": db_product.brand,
            "model": db_product.model,
            "price": float(db_product.base_price),
            "available_quantity": product_data.get("available_quantity", 0)
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

def update_product(db: Session, product_id: int, product_data: dict):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    # Map price to base_price if provided
    if "price" in product_data:
        product_data["base_price"] = product_data.pop("price")

    # Remove fields not in DB
    db_fields = ["sku", "barcode", "product_type", "brand", "model", "base_price", "is_active"]
    
    for key, value in product_data.items():
        if key in db_fields and value is not None:
            setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)

    publish_event(
        "PRODUCT_UPDATED",
        {
            "product_id": db_product.product_id,
            "store_id": product_data.get("store_id", 1),
            "sku": db_product.sku,
            "barcode": db_product.barcode,
            "brand": db_product.brand,
            "model": db_product.model,
            "price": float(db_product.base_price),
            "available_quantity": product_data.get("available_quantity")
        }
    )

    return db_product

def search_products(db: Session, query: str):
    search_filter = f"%{query}%"
    return db.query(Product).filter(
        Product.is_active == True,
        or_(
            Product.sku.ilike(search_filter),
            Product.barcode.ilike(search_filter),
            Product.brand.ilike(search_filter),
            Product.model.ilike(search_filter),
            Product.product_type.ilike(search_filter)
        )
    ).all()
