from app.services.gemini_service import generate_content_with_fallback
from app.services.serpapi_service import fetch_competitors

def analyze_competitors(keyword: str):
    """
    1. Fetch competitors using SerpApi
    2. Use AI to analyze their content strategy and find gaps.
    """
    competitors = fetch_competitors(keyword)
    
    comp_context = "\n".join([
        f"- {c['title']} ({c['link']}): {c['snippet']}" 
        for c in competitors
    ])

    prompt = f"""
    Act as an SEO Competitor Strategist.
    
    Analyze the following top-ranking competitors for the keyword: "{keyword}"
    
    Competitors:
    {comp_context}
    
    TASK:
    1. Identify their common content patterns.
    2. Find "Content Gaps" (topics they missed).
    3. Suggest a superior content angle to outrank them.
    4. Provide a technical SEO advantage strategy.
    
    Rules:
    - Focus on semantic SEO and EEAT.
    - Be highly tactical and specific.
    - Professional, concise tone.
    """
    
    insights = generate_content_with_fallback(prompt)
    
    return {
        "keyword": keyword,
        "competitors": competitors,
        "insights": insights
    }
