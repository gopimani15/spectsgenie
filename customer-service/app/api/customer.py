from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse

router = APIRouter()

@router.post("/", response_model=CustomerResponse)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.phone == customer.phone).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="Customer with this phone already exists")
    
    new_customer = Customer(
        phone=customer.phone,
        name=customer.name,
        email=customer.email,
        gender=customer.gender
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("/", response_model=List[CustomerResponse])
def get_customers(
    q: Optional[str] = None,  # Unified search parameter
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(Customer)
    if q:
        # Search across name, email, and phone using OR logic
        from sqlalchemy import or_
        search_filter = or_(
            Customer.name.contains(q),
            Customer.email.contains(q),
            Customer.phone.contains(q)
        )
        query = query.filter(search_filter)
    return query.offset(skip).limit(limit).all()
