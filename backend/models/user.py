from sqlalchemy import Column, String, Boolean, Integer
from models.base import BaseModel


class User(BaseModel):
    __tablename__ = "users"

    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)

    # gamification fields the frontend's Zustand store already expects
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
