from app.models.user import User
from app.core.security import hash_password, verify_password, create_access_token

def register(db, user):
    u = User(username=user.username, password=hash_password(user.password), role=user.role)
    db.add(u); db.commit(); return u

def login(db, username, password):
    u = db.query(User).filter(User.username==username).first()
    if not u or not verify_password(password, u.password): return None
    return create_access_token({"sub": u.username, "role": u.role})
