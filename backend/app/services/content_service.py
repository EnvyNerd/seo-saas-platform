from .gemini_service import generate_content_with_fallback

def _build_content_prompt(topic: str, content_type: str) -> str:
    return f"""
    Act as a World-Class SEO Strategist and Semantic Content Creator.
    
    TASK: Generate a comprehensive, well-structured SEO Content Strategy and Sample Article for:
    TOPIC: "{topic}"
    CONTENT TYPE: {content_type}

    The output MUST be in high-quality Markdown and follow this exact structure:

    # 1. Strategy Overview
    - **Search Intent:** [Informational/Transactional/Navigational] - Detailed analysis.
    - **Target Audience:** Who is this for?
    - **Topical Authority Score:** How this helps build authority.

    # 2. Semantic Keyword Map
    | Keyword Type | Suggestions | Search Volume Hint |
    | :--- | :--- | :--- |
    | **Primary** | ... | High |
    | **Long-Tail** | ... | Medium |
    | **LSI / Semantic**| ... | N/A |
    | **Questions** | ... | Low-Med |

    # 3. On-Page SEO Assets
    - **SEO Title:** [Compelling, < 60 chars]
    - **Meta Description:** [Action-oriented, < 160 chars]
    - **URL Slug:** [Clean, keyword-rich]

    # 4. Content Outline (H1-H3)
    - Detailed hierarchy of the content.

    # 5. Optimized Content Draft
    [Write the actual content here, using H2s and H3s. Focus on EEAT, flow, and value.]

    # 6. FAQ Section
    - Use Schema-ready question formats.

    ---
    RULES:
    - Use clear headings (#, ##, ###).
    - Use tables for keyword data.
    - Use bolding for emphasis.
    - Use lists for readability.
    - Maintain a professional, expert tone.
    - Focus on Semantic SEO (don't just repeat the keyword).
    """


def generate_content(topic, content_type):
    try:
        prompt = _build_content_prompt(topic, content_type)
        return generate_content_with_fallback(prompt)
    except Exception as e:
        return f"Content AI Error: {str(e)}"

def run_content_arena(topic, content_type):
    """Generates content using both primary and fallback models for comparison."""
    from .gemini_service import get_gemini_model, generate_with_openrouter
    
    prompt = _build_content_prompt(topic, content_type)
    
    results = {}
    
    # Model 1: Gemini
    try:
        model = get_gemini_model()
        if model:
            results["Gemini 2.0 Flash"] = model.generate_content(prompt).text
        else:
            results["Gemini 2.0 Flash"] = "Error: Key missing"
    except Exception as e:
        results["Gemini 2.0 Flash"] = f"Error: {str(e)}"
        
    # Model 2: OpenRouter (DeepSeek/GPT-4o)
    try:
        or_res = generate_with_openrouter(prompt)
        results["OpenRouter (DeepSeek/GPT)"] = or_res if or_res else "Error: Key missing or failed"
    except Exception as e:
        results["OpenRouter (DeepSeek/GPT)"] = f"Error: {str(e)}"
        
    return results
