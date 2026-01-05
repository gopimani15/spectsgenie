from fastapi import APIRouter, Request, HTTPException
import httpx

router = APIRouter()
CUSTOMER_SERVICE_URL = "http://customer-service:8000"

@router.get("/")
async def get_customers(q: str = None, sort_by: str = "recent", skip: int = 0, limit: int = 100):
    async with httpx.AsyncClient() as client:
        try:
            params = {"skip": skip, "limit": limit, "sort_by": sort_by}
            if q:
                params["q"] = q
            
            resp = await client.get(f"{CUSTOMER_SERVICE_URL}/customers/", params=params)
            if resp.status_code >= 400:
                return resp.json()
            
            try:
                return resp.json()
            except Exception:
                raise HTTPException(status_code=502, detail="Invalid response from customer service")
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Customer service unavailable")

@router.post("/")
async def create_customer(request: Request):
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            resp = await client.post(f"{CUSTOMER_SERVICE_URL}/customers/", json=body)
            if resp.status_code >= 400:
                raise HTTPException(status_code=resp.status_code, detail=resp.json())
            return resp.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Customer service unavailable")

@router.put("/{customer_id}")
async def update_customer(customer_id: int, request: Request):
    async with httpx.AsyncClient() as client:
        try:
            body = await request.json()
            resp = await client.put(f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}", json=body)
            if resp.status_code >= 400:
                raise HTTPException(status_code=resp.status_code, detail=resp.json())
            return resp.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Customer service unavailable")

@router.delete("/{customer_id}")
async def delete_customer(customer_id: int):
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.delete(f"{CUSTOMER_SERVICE_URL}/customers/{customer_id}")
            if resp.status_code >= 400:
                raise HTTPException(status_code=resp.status_code, detail=resp.json())
            return resp.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Customer service unavailable")
