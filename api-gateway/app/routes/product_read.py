from fastapi import APIRouter, Request, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
PRODUCT_READ_SERVICE_URL = "http://product-read-model-service:8000/read"

@router.get("/store/{store_id}")
async def get_products_by_store(store_id: int):
    # Public read access or protected? Catalog was protected.
    # Given it's a "Read Model", it might be optimized for public queries, 
    # but let's stick to consistency if unsure. Catalog uses verify_token.
    # But often "Read Models" in CQRS are for UI.
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{PRODUCT_READ_SERVICE_URL}/store/{store_id}"
        )
    return resp.json()
