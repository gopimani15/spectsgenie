from fastapi import APIRouter, HTTPException
from app.services.vendor_service import create_vendor, get_vendor, list_vendors

router = APIRouter()

@router.post("/")
def create(data: dict):
    return create_vendor(data)

@router.get("/{vendor_id}")
def get(vendor_id: int):
    vendor = get_vendor(vendor_id)
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.get("/")
def list_all():
    return list_vendors()
