from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import register, login

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/register")
def register_user(u: UserCreate, db: Session = Depends(get_db)):
    return register(db, u)

@router.post("/login")
def login_user(u: UserLogin, db: Session = Depends(get_db)):
    token = login(db, u.username, u.password)
    if not token: raise HTTPException(status_code=401)
    return {"access_token": token}
