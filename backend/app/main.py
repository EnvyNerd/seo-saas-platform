from fastapi import FastAPI, APIRouter, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.api.routes.seo import router as seo_router
from app.api.routes.ai import router as ai_router
from app.api.routes.keywords import router as keyword_router
from app.api.routes.content import router as content_router
from app.api.routes.competitors import router as competitor_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.auth import router as auth_router
from app.api.routes.deepseek import router as deepseek_router

app = FastAPI(title="AI SEO SaaS Platform")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router with /api prefix
api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(seo_router, prefix="/seo", tags=["SEO"])
api_router.include_router(ai_router, prefix="/ai", tags=["AI"])
api_router.include_router(keyword_router, prefix="/keywords", tags=["Keywords"])
api_router.include_router(content_router, prefix="/content", tags=["Content"])
api_router.include_router(competitor_router, prefix="/competitors", tags=["Competitors"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(deepseek_router, prefix="/deepseek", tags=["DeepSeek"])

app.include_router(api_router)

# Mount Static Files for Screenshots
# Try multiple possible locations for the data/screenshots directory
base_dir = os.getcwd()
screenshot_dir = os.path.join(base_dir, "data", "screenshots")

if not os.path.exists(screenshot_dir):
    # Try relative to this file
    screenshot_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "screenshots"))

if not os.path.exists(screenshot_dir):
    # Try inside backend/data/screenshots
    screenshot_dir = os.path.abspath(os.path.join(base_dir, "backend", "data", "screenshots"))

if not os.path.exists(screenshot_dir):
    os.makedirs(screenshot_dir, exist_ok=True)

app.mount("/screenshots", StaticFiles(directory=screenshot_dir), name="screenshots")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    import logging
    logger = logging.getLogger("uvicorn.error")
    logger.error(f"Validation Error for {request.url}: {exc.errors()}")
    logger.error(f"Request Body: {exc.body}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

@app.get("/")
def root():
    return {
        "message": "SEO AI Backend Running",
        "api_docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
