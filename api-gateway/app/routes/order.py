
from fastapi import APIRouter, Request, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
ORDER_SERVICE_URL = "http://order-service:8000"

@router.post("/")
async def create_order(request: Request, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{ORDER_SERVICE_URL}/orders",
            json=await request.json()
        )
    return resp.json()

@router.get("/{order_id}")
async def get_order(order_id: int, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{ORDER_SERVICE_URL}/orders/{order_id}"
        )
    return resp.json()

@router.put("/{order_id}/pay")
async def pay_order(order_id: int, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.put(
            f"{ORDER_SERVICE_URL}/orders/{order_id}/pay"
        )
    return resp.json()
