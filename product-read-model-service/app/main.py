
from fastapi import FastAPI
from app.api.product_view import router
from app.core.database import Base, engine
from app.models.product_inventory_view import ProductInventoryView

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpectsGenie Product Read Model Service")

app.include_router(router, prefix="/read")

@app.get("/health")
def health():
    return {"status": "UP"}
