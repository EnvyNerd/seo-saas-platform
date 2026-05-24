from app.services.content_service import generate_content, run_content_arena
from app.services.humanizer_service import humanize_text

def run_content_agent(topic: str, context: str = "", content_type: str = "blog post", humanize: bool = False, arena: bool = False):
    """
    Content Agent: Generates SEO-optimized content based on keywords and competitor context.
    Optional: Humanizes the content to bypass AI detection.
    Optional: Arena mode for multi-model comparison.
    """
    print(f"Content Agent: Generating {content_type} for '{topic}'...")
    
    full_topic = topic
    if context:
        full_topic = f"{topic}\n\nAdditional Context/Keywords:\n{context}"
        
    if arena:
        print("Content Agent: Entering Arena Mode (Multi-Model Comparison)...")
        arena_results = run_content_arena(full_topic, content_type)
        return {
            "agent": "Content Agent",
            "mode": "arena",
            "topic": topic,
            "results": arena_results
        }

    content = generate_content(full_topic, content_type)
    
    if humanize:
        print(f"Content Agent: Humanizing content for '{topic}'...")
        content = humanize_text(content)
        
    return {
        "agent": "Content Agent",
        "topic": topic,
        "content_type": content_type,
        "content": content,
        "humanized": humanize
    }
