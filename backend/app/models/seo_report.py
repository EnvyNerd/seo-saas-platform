from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.sql import func
from app.core.database import Base

class SEOReport(Base):
    __tablename__ = "seo_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    url = Column(String, nullable=False)
    seo_score = Column(Float)
    data = Column(JSON) # Stores full audit data (h1, meta, etc)
    ai_recommendations = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
