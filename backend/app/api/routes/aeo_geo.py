from typing import Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.aeo_geo_service import (
    analyze_structured_data,
    analyze_citations,
    analyze_entities,
    analyze_geo,
)

router = APIRouter()


class PageContent(BaseModel):
    url: str
    html: str
    visible_text: Optional[str] = ""
    schema_org: Optional[str] = ""
    headings: Optional[list[str]] = []


@router.post("/structured-data")
def structured_data_endpoint(payload: PageContent):
    return analyze_structured_data(payload.html, payload.schema_org)


@router.post("/citations")
def citations_endpoint(payload: PageContent):
    return analyze_citations(payload.visible_text or "", payload.html)


@router.post("/entities")
def entities_endpoint(payload: PageContent):
    text = payload.visible_text or ""
    headings = payload.headings or []
    return analyze_entities(text, headings)


@router.post("/geo")
def geo_endpoint(payload: PageContent):
    return analyze_geo(payload.html, payload.visible_text or "", payload.schema_org)
