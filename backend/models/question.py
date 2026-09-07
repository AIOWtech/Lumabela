from sqlalchemy import Column, Integer, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Question(BaseModel):
    __tablename__ = "questions"

    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    text = Column(Text, nullable=False)
    choices = Column(JSON, nullable=False)  # e.g. ["Paris", "Rome", "Berlin", "Madrid"]
    correct_index = Column(Integer, nullable=False)  # index into `choices`
    explanation = Column(Text, nullable=True)  # shown after answering, right or wrong
    position = Column(Integer, default=0, nullable=False)

    quiz = relationship("Quiz", back_populates="questions")
