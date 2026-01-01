from fastapi import APIRouter, Request
import httpx

router = APIRouter()

AUTH_SERVICE_URL = "http://auth-service:8000"

@router.post("/login")
async def login(request: Request):
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{AUTH_SERVICE_URL}/auth/login",
            json=await request.json()
        )
    return resp.json()
