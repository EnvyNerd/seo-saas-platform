from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.google_search_console import get_search_analytics

router = APIRouter()

class ConfigSetRequest(BaseModel):
    key: str
    value: str

@router.get("/overview")
def get_analytics_overview(domain: str = "example.com"):
    """
    Get an overview of search performance analytics.
    """
    return get_search_analytics(domain)

@router.get("/doctor")
async def system_doctor():
    """
    Check system health and diagnostics (matching the CLI doctor tool).
    """
    import os
    import requests
    from app.core.database import engine
    from sqlalchemy import text

    env_exists = os.path.exists(".env")

    db_connected = False
    db_error = None
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        db_connected = True
    except Exception as ex:
        db_connected = False
        db_error = str(ex)

    keys = {
        "GEMINI_API_KEY": bool(os.getenv("GEMINI_API_KEY") and not os.getenv("GEMINI_API_KEY").startswith("ADD_YOUR")),
        "OPENROUTER_API_KEY": bool(os.getenv("OPENROUTER_API_KEY") and not os.getenv("OPENROUTER_API_KEY").startswith("ADD_YOUR")),
        "SERPAPI_API_KEY": bool(os.getenv("SERPAPI_API_KEY") and not os.getenv("SERPAPI_API_KEY").startswith("ADD_YOUR"))
    }

    internet = False
    try:
        requests.get("https://google.com", timeout=3)
        internet = True
    except:
        internet = False

    return {
        "env_exists": env_exists,
        "db_connected": db_connected,
        "db_error": db_error,
        "keys": keys,
        "internet_connected": internet
    }

@router.post("/config/set")
def set_env_config(request: ConfigSetRequest):
    """Set a configuration value in the .env file (matching CLI config set)."""
    import os
    from dotenv import set_key
    
    key_upper = request.key.upper()
    if key_upper not in ["GEMINI_API_KEY", "OPENROUTER_API_KEY", "SERPAPI_API_KEY", "DATABASE_URL"]:
        raise HTTPException(status_code=400, detail="Unauthorized key. You can only set GEMINI_API_KEY, OPENROUTER_API_KEY, SERPAPI_API_KEY, or DATABASE_URL.")
    
    try:
        env_path = ".env"
        set_key(env_path, key_upper, request.value)
        # Update current runtime environment variable
        os.environ[key_upper] = request.value
        return {"status": "success", "message": f"Successfully updated {key_upper}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


