from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Topic(BaseModel):
    __tablename__ = "topics"

    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # e.g. "programming" — matches frontend's CourseCategory type

    lessons = relationship(
        "Lesson", back_populates="topic", cascade="all, delete-orphan", order_by="Lesson.position"
    )
