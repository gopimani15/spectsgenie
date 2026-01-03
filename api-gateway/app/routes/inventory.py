from fastapi import APIRouter, Request, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
INVENTORY_SERVICE_URL = "http://inventory-service:8000/inventory"

@router.post("/txn")
async def create_inventory_txn(request: Request, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{INVENTORY_SERVICE_URL}/txn",
            json=await request.json()
        )
    return resp.json()

@router.get("/{store_id}")
async def get_inventory(store_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{INVENTORY_SERVICE_URL}/{store_id}"
        )
    return resp.json()
