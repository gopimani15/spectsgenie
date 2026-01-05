from fastapi import APIRouter, Request, Depends, Query
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

@router.get("/barcode/{barcode}")
async def get_product_by_barcode(barcode: str, store_id: int = Query(None)):
    async with httpx.AsyncClient() as client:
        params = {"store_id": store_id} if store_id else {}
        resp = await client.get(
            f"{PRODUCT_READ_SERVICE_URL}/barcode/{barcode}",
            params=params
        )
        resp.raise_for_status()
    return resp.json()

@router.get("/search")
async def search_read(q: str, store_id: int = Query(None)):
    async with httpx.AsyncClient() as client:
        params = {"q": q}
        if store_id:
            params["store_id"] = store_id
        resp = await client.get(
            f"{PRODUCT_READ_SERVICE_URL}/search",
            params=params
        )
    return resp.json()
