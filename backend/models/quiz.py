from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Quiz(BaseModel):
    __tablename__ = "quizzes"

    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    passing_score = Column(Integer, default=70, nullable=False)  # percent required to "pass"

    lesson = relationship("Lesson", back_populates="quizzes")
    questions = relationship(
        "Question", back_populates="quiz", cascade="all, delete-orphan", order_by="Question.position"
    )
    attempts = relationship("Attempt", back_populates="quiz", cascade="all, delete-orphan")
