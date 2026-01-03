from fastapi import APIRouter, Request, Depends
import httpx
# from app.core.security import verify_token

router = APIRouter()
STORE_SERVICE_URL = "http://store-service:8000"

@router.get("/")
async def get_stores():
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{STORE_SERVICE_URL}/"
        )
    return resp.json()
