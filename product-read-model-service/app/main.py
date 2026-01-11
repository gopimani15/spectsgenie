from fastapi import FastAPI
from app.api.product_view import router as product_view_router
from app.api.vendor import router as vendor_router
from app.api.stock import router as stock_router
from app.api.inventory import router as inventory_router
from app.core.database import Base, engine
from app.models.product_inventory_view import ProductInventoryView
from app.models.vendor import Vendor
from app.models.stock import Stock
from app.models.inventory import Inventory

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpectsGenie Product Read Model Service")

app.include_router(product_view_router, prefix="/read")
app.include_router(vendor_router, prefix="/vendor", tags=["Vendor"])
app.include_router(stock_router, prefix="/stock", tags=["Stock"])
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])

@app.get("/health")
def health():
    return {"status": "UP"}
