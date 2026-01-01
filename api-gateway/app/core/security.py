
from jose import jwt, JWTError
from fastapi import HTTPException, status, Header

SECRET_KEY = "CHANGE_ME"
ALGORITHM = "HS256"

def verify_token(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
