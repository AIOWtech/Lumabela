from datetime import datetime, timezone

from sqlalchemy import DateTime, Column, Integer
from app.database import Base
class BaseModel(Base):
    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
