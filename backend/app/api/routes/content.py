from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.content_agent import run_content_agent
from app.services.humanizer_service import humanize_text


class ContentRequest(BaseModel):
    topic: str
    content_type: str = "Blog Post"
    context: Optional[str] = ""
    humanize: Optional[bool] = False
    arena: Optional[bool] = False


class HumanizeRequest(BaseModel):
    text: str
    intensity: Optional[str] = "medium"


router = APIRouter()


@router.post("/generate")
def generate_seo_content(request: ContentRequest):
    """Generate SEO-optimized content for a given topic with optional humanizer and arena mode"""
    result = run_content_agent(
        topic=request.topic,
        context=request.context,
        content_type=request.content_type,
        humanize=request.humanize,
        arena=request.arena
    )
    return result


@router.post("/humanize")
def humanize_content(request: HumanizeRequest):
    """Rewrite AI-generated content to sound more human"""
    result = humanize_text(request.text, intensity=request.intensity)
    return {
        "original": request.text,
        "humanized": result
    }


@router.get("/suggestions")
def get_content_suggestions(topic: str):
    """Get content suggestions for SEO optimization"""
    return {
        "topic": topic,
        "suggestions": []
    }

