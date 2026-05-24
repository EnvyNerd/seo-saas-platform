from app.agents.seo_audit_agent import audit_website
from app.services.gemini_service import generate_content_with_fallback
import json

def analyze_content_gap(my_url: str, competitor_url: str):
    """
    Comparison Agent: Audits two URLs and identifies gaps in SEO strategy.
    """
    print(f"Comparison Agent: Auditing my site ({my_url})...")
    my_audit = audit_website(my_url)
    
    print(f"Comparison Agent: Auditing competitor site ({competitor_url})...")
    comp_audit = audit_website(competitor_url)
    
    if "error" in my_audit or "error" in comp_audit:
        return {"error": "Failed to audit one or both sites."}
    
    prompt = f"""
    Act as a Senior SEO Strategist.
    
    TASK: Perform a Content Gap Analysis between MY SITE and a COMPETITOR SITE.
    
    MY SITE DATA:
    {json.dumps(my_audit, indent=2)}
    
    COMPETITOR SITE DATA:
    {json.dumps(comp_audit, indent=2)}
    
    OUTPUT FORMAT:
    1. **Executive Summary**: Who is winning and why?
    2. **Structural Gaps**: Compare H1-H3 usage and Content Depth.
    3. **Keyword Gaps**: What topics/keywords is the competitor covering that I am not?
    4. **Action Plan**: List 5 specific steps to outrank this competitor page.
    
    Use Markdown for the response.
    """
    
    print("Comparison Agent: Analyzing gaps with AI...")
    gap_report = generate_content_with_fallback(prompt)
    
    return {
        "my_audit": my_audit,
        "competitor_audit": comp_audit,
        "gap_report": gap_report
    }
