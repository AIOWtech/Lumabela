from sqlalchemy import Column, String, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Lesson(BaseModel):
    __tablename__ = "lessons"

    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=True)  # markdown/plain-text body
    video_url = Column(String(500), nullable=True)
    position = Column(Integer, default=0, nullable=False)  # display order within the topic

    topic = relationship("Topic", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lesson", cascade="all, delete-orphan")
