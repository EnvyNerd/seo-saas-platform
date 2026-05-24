def get_search_analytics(domain: str):
    """
    Mock Google Search Console analytics.
    In a real app, this would use google-api-python-client with OAuth.
    """
    return {
        "domain": domain,
        "total_clicks": 1240,
        "total_impressions": 45600,
        "avg_ctr": "2.7%",
        "avg_position": 12.4,
        "top_keywords": [
            {"query": "seo tools", "clicks": 150, "impressions": 2000},
            {"query": "ai content generator", "clicks": 120, "impressions": 1800},
            {"query": "keyword research", "clicks": 90, "impressions": 1500},
        ]
    }
