from fastapi import APIRouter, Request, Depends, HTTPException
import httpx
from app.core.security import verify_token

router = APIRouter()
PAYMENT_SERVICE_URL = "http://payment-service:8000/payments"

@router.post("/")
async def create_payment(request: Request, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{PAYMENT_SERVICE_URL}/",
            json=await request.json()
        )
    return resp.json()

@router.post("/{payment_id}/refund")
async def refund_payment(payment_id: int, token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{PAYMENT_SERVICE_URL}/{payment_id}/refund"
        )
    return resp.json()
