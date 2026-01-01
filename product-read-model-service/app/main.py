
from fastapi import FastAPI
from app.api.product_view import router

app = FastAPI(title="SpectsGenie Product Read Model Service")

app.include_router(router, prefix="/read")

@app.get("/health")
def health():
    return {"status": "UP"}
