import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Google PageSpeed Insights API Key (Optional but recommended)
PAGESPEED_API_KEY = os.getenv("PAGESPEED_API_KEY")
if PAGESPEED_API_KEY and PAGESPEED_API_KEY.startswith("ADD_YOUR"):
    PAGESPEED_API_KEY = None

def get_lighthouse_metrics(url: str, strategy: str = "desktop"):
    """
    Fetches Lighthouse metrics from Google PageSpeed Insights API.
    Strategies: 'desktop' or 'mobile'
    """
    base_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    
    params = {
        "url": url,
        "strategy": strategy,
        "category": ["performance", "accessibility", "best-practices", "seo"]
    }
    
    if PAGESPEED_API_KEY:
        params["key"] = PAGESPEED_API_KEY

    try:
        response = requests.get(base_url, params=params, timeout=60)
        response.raise_for_status()
        data = response.json()
        
        lighthouse = data.get("lighthouseResult", {})
        categories = lighthouse.get("categories", {})
        
        metrics = {
            "performance": categories.get("performance", {}).get("score", 0) * 100,
            "accessibility": categories.get("accessibility", {}).get("score", 0) * 100,
            "best_practices": categories.get("best-practices", {}).get("score", 0) * 100,
            "seo": categories.get("seo", {}).get("score", 0) * 100,
            "core_web_vitals": {
                "lcp": lighthouse.get("audits", {}).get("largest-contentful-paint", {}).get("displayValue"),
                "cls": lighthouse.get("audits", {}).get("cumulative-layout-shift", {}).get("displayValue"),
                "fcp": lighthouse.get("audits", {}).get("first-contentful-paint", {}).get("displayValue"),
                "tti": lighthouse.get("audits", {}).get("interactive", {}).get("displayValue"),
            }
        }
        
        return metrics
    except Exception as e:
        print(f"Lighthouse API Error: {str(e)}")
        return {"error": str(e)}
