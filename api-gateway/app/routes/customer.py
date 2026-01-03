from fastapi import APIRouter, Request, HTTPException
import httpx

router = APIRouter()
CUSTOMER_SERVICE_URL = "http://customer-service:8000"

@router.get("/")
async def get_customers(q: str = None, skip: int = 0, limit: int = 100):
    async with httpx.AsyncClient() as client:
        try:
            params = {"skip": skip, "limit": limit}
            if q:
                params["q"] = q
            
            resp = await client.get(f"{CUSTOMER_SERVICE_URL}/customers/", params=params)
            return resp.json()
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
