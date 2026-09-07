from sqlalchemy import Column, Integer, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Attempt(BaseModel):
    __tablename__ = "attempts"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    answers = Column(JSON, nullable=False)  # e.g. {"<question_id>": <chosen_index>, ...}
    score = Column(Integer, nullable=False)  # percent correct, computed server-side — never trust a client-sent score
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    quiz = relationship("Quiz", back_populates="attempts")
