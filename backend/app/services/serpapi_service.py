import os
import requests
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def fetch_competitors(keyword: str):
    """
    Fetch top competitors from Google search results using SerpApi.
    If no API key is provided, returns mock data for development.
    """
    if not SERPAPI_KEY or SERPAPI_KEY == "ADD_YOUR_KEY_HERE":
        print("SerpApi key not found. Returning mock competitor data...")
        return _get_mock_competitors(keyword)

    try:
        params = {
            "q": keyword,
            "api_key": SERPAPI_KEY,
            "engine": "google"
        }
        response = requests.get("https://serpapi.com/search", params=params)
        data = response.json()
        
        # Extract organic results
        competitors = []
        for result in data.get("organic_results", [])[:5]: # Top 5
            competitors.append({
                "title": result.get("title"),
                "link": result.get("link"),
                "snippet": result.get("snippet"),
                "position": result.get("position")
            })
        return competitors
    except Exception as e:
        print(f"SerpApi Error: {str(e)}")
        return _get_mock_competitors(keyword)

def _get_mock_competitors(keyword: str):
    return [
        {"title": f"Top {keyword} Guide 2026", "link": "https://competitor1.com", "snippet": "Everything you need to know about " + keyword, "position": 1},
        {"title": f"Why {keyword} Matters", "link": "https://competitor2.com", "snippet": "Industry leaders discuss the impact of " + keyword, "position": 2},
        {"title": f"Best {keyword} Services", "link": "https://competitor3.com", "snippet": "Compare the best options for " + keyword, "position": 3},
    ]
