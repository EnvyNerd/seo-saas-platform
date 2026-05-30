from app.agents.seo_audit_agent import audit_website as playwright_audit

def audit_website(url: str):
    """
    Main SEO Audit Service: Proxies to the deep Playwright agent.
    """
    return playwright_audit(url)
