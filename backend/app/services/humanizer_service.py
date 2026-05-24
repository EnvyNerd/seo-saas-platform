from .gemini_service import generate_content_with_fallback

def humanize_text(text: str, intensity: str = "medium") -> str:
    """
    Humanizer Service: Rewrites AI-generated text to bypass AI detection and sound more natural.
    """
    
    prompt = f"""
    Act as a Professional Human Editor and Creative Writer with expertise in linguistic variability.
    
    TASK: Rewrite the following AI-generated content to make it indistinguishable from human writing.
    INTENSITY: {intensity}

    ORIGINAL CONTENT:
    ---
    {text}
    ---

    GOALS:
    1. **Increase Perplexity & Burstiness:** Vary sentence lengths and structures significantly. Mix short, punchy sentences with longer, more complex ones.
    2. **Remove AI Fingerprints:** Eliminate overused AI words and phrases (e.g., "In the rapidly evolving landscape," "delve," "comprehensive," "essential," "pave the way," "look no further").
    3. **Natural Transitions:** Use conversational and idiomatic transitions instead of stiff, logical connectors like "Furthermore," "Moreover," or "In conclusion."
    4. **Infuse Voice & Tone:** Add a touch of personality, subtle rhetorical questions, or a more direct, engaging style.
    5. **Preserve SEO & Structure:** Keep all Markdown formatting (H1, H2, tables, bolding) and specific SEO keywords exactly as they are. Do not change the underlying meaning or factual accuracy.
    6. **Avoid Repetition:** Ensure words aren't repeated in close proximity.

    OUTPUT RULES:
    - Return ONLY the rewritten content.
    - Maintain the exact same Markdown structure.
    - Do not add any preamble (like "Here is the rewritten text").
    """

    try:
        return generate_content_with_fallback(prompt)
    except Exception as e:
        return f"Humanizer Error: {str(e)}"
