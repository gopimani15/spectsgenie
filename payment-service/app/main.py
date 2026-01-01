
from fastapi import FastAPI
from app.api.payment import router as payment_router

app = FastAPI(title="SpectsGenie Payment Service")

app.include_router(payment_router, prefix="/payments", tags=["Payments"])

@app.get("/health")
def health():
    return {"status": "UP"}
