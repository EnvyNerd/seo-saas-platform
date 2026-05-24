from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class CompetitorAnalysis(Base):
    __tablename__ = "competitor_analyses"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    keyword = Column(String, nullable=False)
    competitors_data = Column(JSON) # List of competitors and their metrics
    ai_insights = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
