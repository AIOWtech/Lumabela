from sqlalchemy import Column, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Note(BaseModel):
    __tablename__ = "notes"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=True)
    content = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=True)  # filled in later by the AI-summarize endpoint, not on write

    user = relationship("User")
    lesson = relationship("Lesson", back_populates="notes")
