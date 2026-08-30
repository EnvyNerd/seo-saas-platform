from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.deep_audit import router as deep_audit_router
from app.api.routes.aeo_geo import router as aeo_geo_router
from app.api.routes.reports import router as reports_router
from app.api.routes.seo import router as seo_router
from app.api.routes.ai import router as ai_router
from app.api.routes.keywords import router as keyword_router
from app.api.routes.content import router as content_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.competitors import router as competitors_router
from app.api.routes.deepseek import router as deepseek_router
from app.api.routes.auth import router as auth_router

app = FastAPI(title="AI SEO SaaS Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deep_audit_router, prefix="/api/audit")
app.include_router(aeo_geo_router, prefix="/api/aeo-geo")
app.include_router(reports_router, prefix="/api/reports")
app.include_router(seo_router, prefix="/api/seo")
app.include_router(ai_router, prefix="/api/ai")
app.include_router(keyword_router, prefix="/api/keywords")
app.include_router(content_router, prefix="/api/content")
app.include_router(analytics_router, prefix="/api/analytics")
app.include_router(competitors_router, prefix="/api/competitors")
app.include_router(deepseek_router, prefix="/api/deepseek")
app.include_router(auth_router, prefix="/api/auth")


@app.get("/")
def root():
    return {
        "message": "SEO AI Backend Running"
    }