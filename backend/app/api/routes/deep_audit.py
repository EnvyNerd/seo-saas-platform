from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.agents.deep_audit_agent import run_deep_audit_agent

router = APIRouter()


class DeepAuditRequest(BaseModel):
    url: str
    ai_recommendations: Optional[bool] = True


@router.post("/deep")
def deep_audit_endpoint(request: DeepAuditRequest):
    result = run_deep_audit_agent(request.url, ai_recommendations=request.ai_recommendations)
    return result
