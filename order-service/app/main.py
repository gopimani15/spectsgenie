
from fastapi import FastAPI
from app.api.order import router as order_router

app = FastAPI(title="SpectsGenie Order Service")

app.include_router(order_router, prefix="/orders", tags=["Orders"])

@app.get("/health")
def health():
    return {"status": "UP"}
