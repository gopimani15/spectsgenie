from fastapi import APIRouter, Request, Depends
import httpx
from app.core.security import verify_token

router = APIRouter()
PRESCRIPTION_SERVICE_URL = "http://prescription-service:8000"

@router.get("/")
async def get_prescriptions(token=Depends(verify_token)):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{PRESCRIPTION_SERVICE_URL}/"
        )
    return resp.json()
