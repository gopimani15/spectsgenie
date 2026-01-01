
from fastapi import FastAPI
from app.api.inventory import router as inventory_router

app = FastAPI(title="SpectsGenie Inventory Service")

app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])

@app.get("/health")
def health():
    return {"status": "UP"}
