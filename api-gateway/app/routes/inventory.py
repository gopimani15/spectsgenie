from fastapi import APIRouter, Request
import httpx

router = APIRouter()
INVENTORY_SERVICE_URL = "http://inventory-service:8000/inventory"

@router.post("/")
async def create_inventory(request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{INVENTORY_SERVICE_URL}/",
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
