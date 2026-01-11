from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Store, Base

Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_stores(db: Session = Depends(get_db)):
    return db.query(Store).all()

@router.get("/stores/{store_id}")
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.store_id == store_id).first()
    if not store:
        return {"detail": "Not Found"}, 404
    return store
