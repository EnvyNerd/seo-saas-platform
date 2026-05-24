from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.keywords_service import get_keyword_data, generate_keywords

router = APIRouter()


class KeywordRequest(BaseModel):
    topic: str


class BatchKeywordRequest(BaseModel):
    topics: List[str]


@router.post("/generate")
def keywords_generate(request: KeywordRequest):
    """Generate SEO keywords for a given topic"""
    result = generate_keywords(request.topic)
    return {
        "keywords": result
    }


@router.post("/batch")
def keywords_generate_batch(request: BatchKeywordRequest):
    """Generate keywords for multiple topics in batch."""
    results = []
    for topic in request.topics:
        if topic.strip():
            results.append({
                "topic": topic.strip(),
                "keywords": generate_keywords(topic.strip())
            })
    return {"results": results}


@router.get("/analysis")
def keywords_analysis(keyword: str):
    """Analyze keywords for SEO insights"""
    result = get_keyword_data(keyword)
    return {
        "keyword": keyword,
        "analysis": result
    }

