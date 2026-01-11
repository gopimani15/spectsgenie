from app.models.vendor import Vendor
from app.core.database import SessionLocal

def create_vendor(data):
    db = SessionLocal()
    vendor = Vendor(**data)
    db.add(vendor)
    db.commit()
    db.refresh(vendor)
    db.close()
    return vendor

def get_vendor(vendor_id):
    db = SessionLocal()
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    db.close()
    return vendor

def list_vendors():
    db = SessionLocal()
    vendors = db.query(Vendor).all()
    db.close()
    return vendors
