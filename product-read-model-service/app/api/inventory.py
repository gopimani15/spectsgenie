from fastapi import APIRouter, HTTPException
from app.services.inventory_service import create_inventory, get_inventory, list_inventories

router = APIRouter()

@router.post("/")
def create(data: dict):
    return create_inventory(data)

@router.get("/{inventory_id}")
def get(inventory_id: int):
    inventory = get_inventory(inventory_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return inventory

@router.get("/")
def list_all():
    return list_inventories()
