from app.services.keywords_service import generate_keywords

def run_keyword_agent(topic: str):
    """
    Keyword Agent: Focuses on topical research and semantic keyword extraction.
    """
    print(f"Keyword Agent: Researching topic '{topic}'...")
    results = generate_keywords(topic)
    return {
        "agent": "Keyword Agent",
        "topic": topic,
        "keywords_report": results
    }
