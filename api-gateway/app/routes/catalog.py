
from fastapi import APIRouter, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
CATALOG_SERVICE_URL = "http://catalog-service:8000"

@router.get("/products")
async def list_products(token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{CATALOG_SERVICE_URL}/catalog/products")
    return resp.json()
