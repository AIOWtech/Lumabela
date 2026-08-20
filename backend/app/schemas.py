from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # lets us return a SQLAlchemy User directly

    id: int
    name: str
    email: EmailStr
    is_premium: bool
    level: int
    xp: int
    streak: int


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
