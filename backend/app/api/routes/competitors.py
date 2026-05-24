from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.agents.competitor_agent import analyze_competitors
from app.agents.comparison_agent import analyze_content_gap

router = APIRouter()

class CompetitorRequest(BaseModel):
    keyword: str

class CompareRequest(BaseModel):
    my_url: str
    competitor_url: str

@router.post("/analyze")
def competitor_analysis(request: CompetitorRequest):
    """
    Run a competitive analysis for a target keyword.
    Discover who is ranking and how to beat them.
    """
    try:
        if not request.keyword.strip():
            raise HTTPException(status_code=400, detail="Keyword cannot be empty")
        
        result = analyze_competitors(request.keyword)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare")
def compare_sites(request: CompareRequest):
    """
    Run a Content Gap Analysis between two sites (Comparison Agent).
    """
    try:
        if not request.my_url.strip() or not request.competitor_url.strip():
            raise HTTPException(status_code=400, detail="URLs cannot be empty")
        
        result = analyze_content_gap(request.my_url, request.competitor_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

