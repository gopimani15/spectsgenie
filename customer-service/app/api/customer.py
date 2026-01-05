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
        # If customer exists but is inactive, reactivate instead of error
        if not db_customer.is_active:
            db_customer.is_active = True
            db_customer.name = customer.name
            db_customer.email = customer.email
            db_customer.gender = customer.gender
            db_customer.is_vip = customer.is_vip
            db.commit()
            db.refresh(db_customer)
            return db_customer
        raise HTTPException(status_code=400, detail="Customer with this phone already exists")
    
    new_customer = Customer(
        phone=customer.phone,
        name=customer.name,
        email=customer.email,
        gender=customer.gender,
        is_vip=customer.is_vip
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.get("/", response_model=List[CustomerResponse])
def get_customers(
    q: Optional[str] = None, 
    sort_by: Optional[str] = "recent",
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(Customer).filter(Customer.is_active == True)
    
    if q:
        from sqlalchemy import or_
        search_filter = or_(
            Customer.name.ilike(f"%{q}%"),
            Customer.email.ilike(f"%{q}%"),
            Customer.phone.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)
    
    # Sorting logic
    if sort_by == "spent":
        query = query.order_by(Customer.total_spent.desc())
    elif sort_by == "visits":
        query = query.order_by(Customer.total_visits.desc())
    else: # recent
        query = query.order_by(Customer.created_at.desc())

    return query.offset(skip).limit(limit).all()

@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(customer_id: int, customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db_customer.name = customer.name
    db_customer.phone = customer.phone
    db_customer.email = customer.email
    db_customer.gender = customer.gender
    db_customer.is_vip = customer.is_vip
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    db_customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    db_customer.is_active = False
    db.commit()
    return {"message": "Customer deleted successfully"}
