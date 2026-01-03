from fastapi import FastAPI
from app.api.customer import router
from app.core.database import Base, engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SpectsGenie Customer Service")

app.include_router(router, prefix="/customers", tags=["Customers"])

@app.get("/health")
def health():
    return {"status": "UP"}
