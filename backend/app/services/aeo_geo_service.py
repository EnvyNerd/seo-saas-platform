import re
import json
from typing import Any, Dict, List


def _try_parse_json_ld(html: str) -> List[Dict[str, Any]]:
    results = []
    for match in re.finditer(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', html, re.DOTALL | re.IGNORECASE):
        raw = match.group(1)
        try:
            obj = json.loads(raw)
            if isinstance(obj, dict):
                results.append(obj)
            elif isinstance(obj, list):
                results.extend([x for x in obj if isinstance(x, dict)])
        except Exception:
            continue
    return results


def analyze_structured_data(html: str, schema_org: str) -> Dict[str, Any]:
    issues: List[str] = []
    recommendations: List[str] = []
    score = 100
    parsed = []

    if schema_org and schema_org.strip():
        try:
            obj = json.loads(schema_org)
            if isinstance(obj, dict):
                parsed.append(obj)
            elif isinstance(obj, list):
                parsed.extend([x for x in obj if isinstance(x, dict)])
        except Exception:
            issues.append("Provided schema.org snippet is not valid JSON.")
            score -= 25

    embedded = _try_parse_json_ld(html)
    combined = parsed + embedded
    types = [item.get("@type") for item in combined]

    if not combined:
        issues.append("No JSON-LD structured data detected.")
        recommendations.append("Add relevant JSON-LD such as Article, FAQPage, HowTo, Product, Organization, or WebSite.")
        score -= 40
    else:
        if not any(t in ["FAQPage", "Question"] for t in types):
            recommendations.append("Add FAQPage JSON-LD when the page includes questions and answers.")
            score -= 5
        if not any(t in ["Article", "BlogPosting", "NewsArticle"] for t in types):
            recommendations.append("Use Article/BlogPosting markup for editorial pages.")
            score -= 5
        if not any(t in ["Organization", "WebSite"] for t in types):
            recommendations.append("Add Organization or WebSite markup to improve entity grounding.")
            score -= 5

    # Basic field checks
    for item in combined:
        if not item.get("name") and not item.get("headline"):
            issues.append("A structured-data item is missing a prominent title field.")
            score -= 5
        if item.get("@type") in ["Article", "BlogPosting", "NewsArticle"]:
            if not item.get("author") and not item.get("publisher"):
                recommendations.append("Complete Article/BlogPosting with author and publisher fields.")
                score -= 3
                break

    score = max(0, min(100, score))
    return {
        "score": score,
        "json_ld_count": len(combined),
        "types": [t for t in types if t],
        "issues": issues,
        "recommendations": recommendations,
    }


def analyze_citations(visible_text: str, html: str) -> Dict[str, Any]:
    issues: List[str] = []
    recommendations: List[str] = []
    score = 100
    text = visible_text.strip()
    links = re.findall(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>([^<]*)</a>', html, re.IGNORECASE)

    if not text:
        issues.append("No visible text provided; citation analysis is limited.")
        score -= 15
        recommendations.append("Expose clean readable text for AEO/GEO analysis.")
        return {
            "score": max(0, min(100, score)),
            "issues": issues,
            "recommendations": recommendations,
            "source_links": [],
            "statistics": {"source_count": 0, "unique_domains": 0},
        }

    # citation-like patterns
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
    cited_sentences = []
    source_links = []
    seen_domains = set()

    for href, anchor in links:
        anchor_clean = anchor.strip()
        if not anchor_clean:
            continue
        source_links.append({"href": href, "anchor": anchor_clean})
        try:
            from urllib.parse import urlparse
            parsed = urlparse(href)
            if parsed.hostname:
                seen_domains.add(parsed.hostname.lower())
        except Exception:
            pass

    citation_indicators = ["according to", "per", "cites", "research shows", "study shows", "source:", "via ", "published in", "data from", "report by"]
    matched = 0
    for sentence in sentences:
        lowered = sentence.lower()
        if any(indicator in lowered for indicator in citation_indicators):
            cited_sentences.append(sentence)
            matched += 1

    source_count = len(source_links)
    unique_domains = len(seen_domains)
    coverage = min(1.0, matched / max(1, len(sentences))) if sentences else 0.0

    if source_count == 0:
        issues.append("No outbound links detected in the page HTML.")
        recommendations.append("Add high-authority outbound sources that support claims.")
        score -= 30
    else:
        if unique_domains < min(3, source_count):
            recommendations.append("Use more diverse high-authority sources.")
            score -= 10

    if coverage < 0.08:
        recommendations.append("Explicitly attribute claims with source phrasing; this improves answerability for AI surfaces.")
        score -= 15

    if len(cited_sentences) > 0 and source_count > 0:
        recommendations.append("Keep citations contextually accurate between anchor text and surrounding claims.")

    score = max(0, min(100, score))
    return {
        "score": score,
        "issues": issues,
        "recommendations": recommendations,
        "source_links": source_links[:20],
        "statistics": {
            "source_count": source_count,
            "unique_domains": unique_domains,
            "cited_sentence_count": matched,
            "coverage_estimate": round(coverage, 4),
        },
    }


def analyze_entities(text: str, headings: List[str]) -> Dict[str, Any]:
    issues: List[str] = []
    recommendations: List[str] = []
    score = 100
    combined = (text or "") + " " + " ".join([str(h) for h in headings if h])
    words = combined.split()
    lowered = combined.lower()

    people_markers = ["dr ", "dr.", "ceo", "founder", "researcher", "professor", "author ", "scientist"]
    org_markers = ["university", "institute", "company", "foundation", "journal", "government", "agency", "report", "ministry"]
    location_markers = ["city", "country", "region", "state", "province", "county"]

    entity_types_present = {
        "people": sum(1 for m in people_markers if m in lowered),
        "organizations": sum(1 for m in org_markers if m in lowered),
        "locations": sum(1 for m in location_markers if m in lowered),
    }

    missing = [k for k, v in entity_types_present.items() if v == 0]
    if missing:
        recommendations.append(
            "Add explicit named entities where applicable: "
            "people, organizations, and locations improve GEO/AEO grounding."
        )
        score -= 5 * len(missing)

    if len(text.strip()) < 400:
        issues.append("Text appears short; entity coverage may be weak.")
        recommendations.append("Expand content so entities can be mentioned naturally.")
        score -= 15

    if len(headings) == 0:
        issues.append("No headings provided; entity context is less scannable.")
        recommendations.append("Include topic-aligned headings to anchor entities.")
        score -= 10

    score = max(0, min(100, score))
    return {
        "score": score,
        "entity_types_present": entity_types_present,
        "issues": issues,
        "recommendations": recommendations,
    }


def analyze_geo(html: str, visible_text: str, schema_org: str) -> Dict[str, Any]:
    structured = analyze_structured_data(html, schema_org)
    citations = analyze_citations(visible_text, html)
    entities = analyze_entities(visible_text or "", [])

    scores = [structured["score"], citations["score"], entities["score"]]
    geo_score = round(sum(scores) / len(scores))
    issues = structured["issues"] + citations["issues"] + entities["issues"]
    recommendations = structured["recommendations"] + citations["recommendations"] + entities["recommendations"]
    unique_recommendations = list(dict.fromkeys(recommendations))

    return {
        "geo_score": geo_score,
        "aeo_score": citations["score"],
        "components": {
            "structured_data": structured,
            "citations": citations,
            "entities": entities,
        },
        "issues": issues,
        "recommendations": unique_recommendations[:20],
    }
