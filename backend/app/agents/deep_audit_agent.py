"""
Deep SEO Audit Agent
====================
Runs the 6-pillar deep audit and generates AI-powered recommendations per pillar.
"""

from app.services.deep_audit_service import run_deep_audit
from app.services.gemini_service import generate_content_with_fallback


def _build_recommendation_prompt(audit_result: dict) -> str:
    """Build a detailed prompt for AI recommendations based on audit findings."""
    url = audit_result.get("url", "")
    overall = audit_result.get("overall_score", 0)
    grade = audit_result.get("overall_grade", "?")

    pillar_summaries = []
    for p in audit_result.get("pillars", []):
        findings_text = "\n".join(f"  {f}" for f in p["findings"])
        pillar_summaries.append(
            f"{p['pillar']} — Score: {p['score']}/100\n{findings_text}"
        )

    aeo_geo = audit_result.get("aeo_geo") or {}
    geo_score = aeo_geo.get("geo_score")
    aeo_score = aeo_geo.get("aeo_score")
    components = aeo_geo.get("components", {})
    structured = components.get("structured_data", {})
    citations = components.get("citations", {})
    entities = components.get("entities", {})
    recommendations = aeo_geo.get("recommendations") or []

    aeo_geo_summaries = []
    if structured:
        findings_text = "\n".join(f"  {f}" for f in (structured.get("issues") or []))
        recs_text = "\n".join(f"  - {r}" for r in (structured.get("recommendations") or []))
        aeo_geo_summaries.append(
            f"Structured Data — Score: {structured.get('score')}/100\nFindings:\n{findings_text}\nRecommendations:\n{recs_text}"
        )
    if citations:
        findings_text = "\n".join(f"  {f}" for f in (citations.get("issues") or []))
        recs_text = "\n".join(f"  - {r}" for r in (citations.get("recommendations") or []))
        aeo_geo_summaries.append(
            f"Citations — Score: {citations.get('score')}/100\nFindings:\n{findings_text}\nRecommendations:\n{recs_text}"
        )
    if entities:
        findings_text = "\n".join(f"  {f}" for f in (entities.get("issues") or []))
        recs_text = "\n".join(f"  - {r}" for r in (entities.get("recommendations") or []))
        aeo_geo_summaries.append(
            f"Entities — Score: {entities.get('score')}/100\nFindings:\n{findings_text}\nRecommendations:\n{recs_text}"
        )

    aeo_geo_text = "\n\n".join(aeo_geo_summaries)
    aeo_geo_section = ""
    if geo_score is not None or aeo_score is not None or aeo_geo_text:
        parts = []
        if aeo_score is not None:
            parts.append(f"AEO Score: {aeo_score}/100")
        if geo_score is not None:
            parts.append(f"GEO Score: {geo_score}/100")
        header = ", ".join(parts) if parts else "AEO/GEO"
        aeo_geo_section = f"\n## AEO/GEO Analysis\n**{header}**\n\n{aeo_geo_text}\n"

    all_findings = "\n\n".join(pillar_summaries)

    return f"""
    You are a Senior SEO Auditor and Web Performance Expert. You have just completed
    a comprehensive 6-pillar SEO audit for: {url}

    OVERALL SCORE: {overall}/100 (Grade: {grade})

    DETAILED FINDINGS BY PILLAR:
    {all_findings}

{aeo_geo_section}    TASK: Generate a professional, actionable SEO audit report in Markdown format.

    Structure your response as:

    # Executive Summary
    Brief overview of the site's SEO health and the most critical issues to fix first.

    # Priority Fixes (Top 5)
    The 5 most impactful changes, ordered by priority. For each:
    - What the issue is
    - Why it matters (impact on rankings/traffic)
    - How to fix it (specific, actionable steps)

    # Quick Wins
    Items that can be fixed in under 30 minutes with outsized impact.

    # Long-Term Strategy
    Strategic recommendations for sustained SEO improvement over the next 3-6 months.

    RULES:
    - Be specific, not generic. Reference actual findings from the audit.
    - Use markdown formatting with headers, bold, and lists.
    - Be concise — actionable over exhaustive.
    - Professional tone, expert-level recommendations.
    """


def run_deep_audit_agent(url: str, ai_recommendations: bool = True) -> dict:
    """
    Agent entry point: runs the deep audit and optionally generates AI recommendations.
    """
    print(f"Deep SEO Auditor: Starting full 6-pillar audit of {url}...")

    audit = run_deep_audit(url)

    if audit.get("error") and not audit.get("pillars"):
        return audit

    if ai_recommendations:
        print("Deep SEO Auditor: Generating AI recommendations...")
        try:
            prompt = _build_recommendation_prompt(audit)
            recommendations = generate_content_with_fallback(prompt)
            audit["ai_recommendations"] = recommendations
        except Exception as e:
            audit["ai_recommendations"] = f"AI Recommendation Error: {str(e)}"

    return audit


def format_audit_report(audit: dict) -> str:
    """Format the full audit result into a readable Markdown report."""
    lines = []

    url = audit.get("url", "Unknown")
    overall = audit.get("overall_score", 0)
    grade = audit.get("overall_grade", "?")

    lines.append(f"# SEO Deep Audit Report: {url}")
    lines.append(f"")
    lines.append(f"**Overall Score:** {overall}/100 | **Grade:** {grade}")
    lines.append(f"**Audited:** {audit.get('metadata', {}).get('audited_at', 'N/A')}")
    lines.append(f"**Response Time:** {audit.get('response_time_ms', 'N/A')}ms | **Status:** {audit.get('status_code', 'N/A')}")
    lines.append(f"")
    lines.append(f"---")
    lines.append(f"")

    # Pillar scores visual
    lines.append(f"## Pillar Scores Overview")
    lines.append(f"")
    lines.append(f"| Pillar | Score | Grade |")
    lines.append(f"|--------|-------|-------|")

    for p in audit.get("pillars", []):
        p_grade = _score_to_grade(p["score"])
        bar = "█" * (p["score"] // 5) + "░" * (20 - p["score"] // 5)
        lines.append(f"| {p['pillar']} | {bar} {p['score']}/100 | {p_grade} |")

    lines.append(f"")
    lines.append(f"---")
    lines.append(f"")

    # Detailed findings per pillar
    for p in audit.get("pillars", []):
        lines.append(f"## {p['pillar']}")
        lines.append(f"**Score: {p['score']}/100**")
        lines.append(f"")
        for finding in p["findings"]:
            lines.append(f"- {finding}")
        lines.append(f"")

    lines.append(f"---")
    lines.append(f"")

    # AEO/GEO analysis
    aeo_geo = audit.get("aeo_geo") or {}
    if aeo_geo:
        lines.append(f"## AEO/GEO Analysis")
        if aeo_geo.get("aeo_score") is not None:
            lines.append(f"**AEO Score:** {aeo_geo['aeo_score']}/100")
        if aeo_geo.get("geo_score") is not None:
            lines.append(f"**GEO Score:** {aeo_geo['geo_score']}/100")
        lines.append(f"")
        for name, comp in (aeo_geo.get("components") or {}).items():
            lines.append(f"### {name.title().replace('_', ' ')}")
            lines.append(f"**Score:** {comp.get('score')}/100")
            lines.append(f"")
            for issue in comp.get("issues") or []:
                lines.append(f"- {issue}")
            lines.append(f"")
            for rec in comp.get("recommendations") or []:
                lines.append(f"- {rec}")
            lines.append(f"")

    lines.append(f"---")
    lines.append(f"")

    # AI Recommendations
    if audit.get("ai_recommendations"):
        lines.append(audit["ai_recommendations"])

    return "\n".join(lines)


def _score_to_grade(score: float) -> str:
    """Convert numeric score to letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B+"
    elif score >= 70:
        return "B"
    elif score >= 60:
        return "C+"
    elif score >= 50:
        return "C"
    elif score >= 40:
        return "D"
    else:
        return "F"
