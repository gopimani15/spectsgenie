
from fastapi import FastAPI
from app.api.catalog import router as catalog_router
from app.core.database import Base, engine
from app.models.product import Product

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpectsGenie Catalog Service")

app.include_router(catalog_router, prefix="/catalog", tags=["Catalog"])

@app.get("/health")
def health():
    return {"status": "UP"}
