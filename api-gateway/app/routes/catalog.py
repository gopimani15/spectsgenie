
from fastapi import APIRouter, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
CATALOG_SERVICE_URL = "http://catalog-service:8000"

@router.get("/products")
async def list_products():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{CATALOG_SERVICE_URL}/catalog/products")
    return resp.json()

@router.get("/products/search")
async def search_products(q: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{CATALOG_SERVICE_URL}/catalog/products/search", params={"q": q})
    return resp.json()

@router.post("/products")
async def create_product(product: dict):
    print(f"DEBUG: create_product received: {product}")
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{CATALOG_SERVICE_URL}/catalog/products", json=product)
    print(f"DEBUG: catalog-service response: {resp.status_code} - {resp.text}")
    return resp.json()

@router.put("/products/{product_id}")
async def update_product(product_id: int, product: dict):
    print(f"DEBUG: update_product {product_id} received: {product}")
    async with httpx.AsyncClient() as client:
        resp = await client.put(f"{CATALOG_SERVICE_URL}/catalog/products/{product_id}", json=product)
    print(f"DEBUG: catalog-service response: {resp.status_code} - {resp.text}")
    return resp.json()

@router.delete("/products/{product_id}")
async def delete_product(product_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.delete(f"{CATALOG_SERVICE_URL}/catalog/products/{product_id}")
    return resp.json()
