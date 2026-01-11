from fastapi import FastAPI
from app.api.order import router as order_router
from app.core.database import Base, engine
from app.models.order import Order
from app.models.order_item import OrderItem

app = FastAPI(title="SpectsGenie Order Service")

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(order_router, prefix="/orders", tags=["Orders"])

@app.get("/health")
def health():
    return {"status": "UP"}
