from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, order, catalog, inventory, payment, prescription, product_read, store, customer

app = FastAPI(title="SpectsGenie API Gateway")

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(order.router, prefix="/orders", tags=["Orders"])
app.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(payment.router, prefix="/payments", tags=["Payments"])
app.include_router(prescription.router, prefix="/prescriptions", tags=["Prescriptions"])
app.include_router(product_read.router, prefix="/read", tags=["Product Read"])
app.include_router(store.router, prefix="/stores", tags=["Stores"])
app.include_router(customer.router, prefix="/customers", tags=["Customers"])

@app.get("/health")
def health():
    return {"status": "UP"}
