from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from app.core.database import Base

class KeywordResearch(Base):
    __tablename__ = "keyword_research"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    topic = Column(String, nullable=False)
    results = Column(Text) # Stores AI generated keyword strategy
    created_at = Column(DateTime(timezone=True), server_default=func.now())
