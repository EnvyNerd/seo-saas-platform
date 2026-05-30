from typing import List
from pydantic import BaseModel
from fastapi import APIRouter
from app.services.seo_audit_service import audit_website
from app.services.lighthouse_service import get_lighthouse_metrics

router = APIRouter()


@router.get("/audit")
def seo_audit(url: str):
    return audit_website(url)


@router.get("/lighthouse")
def seo_lighthouse(url: str, strategy: str = "desktop"):
    """Fetch Lighthouse metrics for a URL."""
    return get_lighthouse_metrics(url, strategy)


class BatchAuditRequest(BaseModel):
    urls: List[str]


@router.post("/audit/batch")
def seo_audit_batch(request: BatchAuditRequest):
    """Run SEO audits on multiple URLs in batch."""
    results = []
    for url in request.urls:
        if url.strip():
            results.append(audit_website(url.strip()))
    return {"results": results}


@router.post("/schema")
def seo_schema(audit_data: dict):
    """Generate JSON-LD Schema Markup based on website audit data."""
    from app.services.gemini_service import generate_schema_markup
    markup = generate_schema_markup(audit_data)
    return {"schema": markup}