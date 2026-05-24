from .gemini_service import generate_content_with_fallback

def _build_keyword_prompt(topic: str) -> str:
    return f"""
    Act as an Expert SEO Keywords Strategist.

    Your task is:
    Generate high-value SEO keywords for the topic provided.

    Include:
    - primary keywords
    - long-tail keywords
    - semantic keywords
    - question keywords
    - low-competition opportunities
    - search intent analysis

    Optimize for:
    - Google SEO
    - semantic relevance
    - topical authority
    - user search intent

    Topic:
    {topic}

    Format cleanly with bullet points.
    """


def generate_keywords(topic: str) -> str:
    """
    Act as Expert SEO keywords Strategiest 

    generate high - value SEO keywords for the topic provided.
    
    Args:
        topic: The topic to generate keywords for
        
    Returns:
        Formatted string with keyword suggestions or error message
    """
    try:
        if not topic or not topic.strip():
            return "Error: Topic cannot be empty"

        prompt = _build_keyword_prompt(topic)
        return generate_content_with_fallback(prompt)

    except Exception as e:
        return f"Keyword AI Error: {str(e)}"


def get_keyword_data(keyword: str) -> str:
    """
    Retrieve and analyze keyword data for SEO insights.
    
    Args:
        keyword: The keyword to analyze
        
    Returns:
        Formatted string with keyword analysis or error message
    """
    return generate_keywords(keyword)
