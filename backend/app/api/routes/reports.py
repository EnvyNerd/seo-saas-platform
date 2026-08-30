from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import select, desc
from app.core.database import AsyncSessionLocal
from app.models.seo_report import SEOReport

router = APIRouter()


class LatestReportRequest(BaseModel):
    project_id: int


@router.post("/latest")
async def get_latest_report(payload: LatestReportRequest):
    async with AsyncSessionLocal() as session:
        stmt = (
            select(SEOReport)
            .where(SEOReport.project_id == payload.project_id)
            .order_by(desc(SEOReport.created_at))
            .limit(1)
        )
        result = await session.execute(stmt)
        report = result.scalar_one_or_none()

        if not report:
            raise HTTPException(status_code=404, detail="No reports found")

    data = report.data or {}
    return {
        "report_id": report.id,
        "project_id": report.project_id,
        "url": report.url,
        "created_at": report.created_at.isoformat() if report.created_at else None,
        "seo_score": report.seo_score,
        "ai_recommendations": report.ai_recommendations,
        "overall_score": data.get("overall_score", report.seo_score),
        "overall_grade": data.get("overall_grade"),
        "response_time_ms": data.get("response_time_ms"),
        "status_code": data.get("status_code"),
        "technical_meta": data.get("technical_meta", {}),
        "metadata": data.get("metadata", {}),
        "pillars": data.get("pillars", []),
        "aeo_geo": data.get("aeo_geo", {}),
    }


DEMO_REPORT = {
    "report_id": "demo",
    "project_id": None,
    "url": "https://example.com",
    "created_at": None,
    "seo_score": 61,
    "overall_score": 61,
    "overall_grade": "D",
    "response_time_ms": 420,
    "status_code": 200,
    "technical_meta": {
        "title": "Example Domain",
        "screenshot_path": None,
    },
    "metadata": {
        "word_count": 21,
        "total_links": 18,
        "missing_alt": 0,
    },
    "pillars": [
        {"pillar": "1. Crawlability & Indexability", "score": 72, "findings": ["✅ robots meta: index, follow", "✅ Canonical tag present"]},
        {"pillar": "2. Technical Performance", "score": 48, "findings": ["❌ Missing XML sitemap"]},
        {"pillar": "3. Content Quality & Intent Match", "score": 47, "findings": ["❌ Missing meta description", "❌ Thin content"]},
        {"pillar": "4. Search Visibility", "score": 79, "findings": ["✅ HTTP 200"]},
        {"pillar": "5. Brand Representation", "score": 62, "findings": ["⚠️ Minimal brand schema"]},
        {"pillar": "6. Authority Signals", "score": 95, "findings": ["✅ Domain authority context present"]},
    ],
    "aeo_geo": {
        "aeo_score": 48,
        "geo_score": 47,
        "components": {
            "structured_data": {
                "score": 15,
                "issues": ["No JSON-LD structured data detected."],
                "recommendations": ["Add Organization and FAQPage schema."],
            },
            "citations": {"score": 60, "issues": [], "recommendations": ["Add verifiable factual citations."]},
            "entities": {"score": 55, "issues": [], "recommendations": ["Clarify primary entity and attributes."]},
        },
        "recommendations": ["Improve AEO readiness with structured data.", "Add clear entity definitions for GEO."],
    },
    "recommendations": [
        {
            "id": 1,
            "title": "Generate XML Sitemap",
            "pillars": ["SEO", "Technical"],
            "severity": "high",
            "description": "Create and submit an XML sitemap to help search engines discover and index all site URLs efficiently.",
            "effort": "low",
        },
        {
            "id": 2,
            "title": "Add Meta Description",
            "pillars": ["SEO", "AEO"],
            "severity": "high",
            "description": "Include a meta description to improve click-through rates and provide search engines with a concise summary of the page content.",
            "effort": "low",
        },
        {
            "id": 3,
            "title": "Implement Structured Data (JSON-LD)",
            "pillars": ["AEO", "GEO", "Technical"],
            "severity": "high",
            "description": "Add Organization and FAQPage schema to help AI and search engines understand entity information and provide direct answers.",
            "effort": "medium",
        },
        {
            "id": 4,
            "title": "Expand Content Depth",
            "pillars": ["Content", "SEO", "AEO"],
            "severity": "high",
            "description": "Increase page content to at least 600-900 words to provide authority and satisfy user search intent, which is critical for ranking.",
            "effort": "high",
        },
        {
            "id": 5,
            "title": "Add Canonical URL",
            "pillars": ["Technical"],
            "severity": "high",
            "description": "No canonical link tag was found, risking duplicate-content issues.",
            "effort": "low",
        },
    ],
    }


@router.get("/demo")
async def get_demo_report():
    return DEMO_REPORT
