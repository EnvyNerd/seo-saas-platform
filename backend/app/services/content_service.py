import re

from .gemini_service import generate_content_with_fallback


def _parse_heading_markers(content: str) -> list:
    """
    Parse heading markers from generated content.
    Returns a list of dicts: [{level, score, text, line_num}, ...]
    
    Expected format: ## [H2] [★★★★☆ 4/5] Heading Text
    """
    headings = []
    for i, line in enumerate(content.splitlines(), 1):
        # Match headings with markers: ## [H2] [★★★★☆ 4/5] Text
        m = re.match(r'^(#{1,6})\s+\[(H\d)\]\s+\[([★☆]{5})\s+(\d)/5\]\s+(.+)', line)
        if m:
            full_marker = m.group(3)
            score = int(m.group(4))
            headings.append({
                "line": i,
                "level": m.group(2),
                "stars": full_marker,
                "score": score,
                "text": m.group(5).strip(),
                "raw_line": line,
            })
    return headings


def _heading_scorecard(headings: list, topic: str) -> str:
    """
    Build a formatted heading quality scorecard table.
    """
    if not headings:
        return "No scored headings found in the content."

    lines = []
    lines.append(f"\n---\n")
    lines.append(f"# Heading Quality Scorecard")
    lines.append(f"")
    lines.append(f"| # | Level | Score | Heading | Verdict |")
    lines.append(f"|---|-------|-------|---------|---------|")

    emoji_map = {
        5: "🟢 Excellent",
        4: "🟢 Good",
        3: "🟡 Average",
        2: "🟠 Weak",
        1: "🔴 Poor",
    }

    for idx, h in enumerate(headings, 1):
        verdict = emoji_map.get(h["score"], "⚪ N/A")
        safe_text = h["text"].replace("|", "\\|")
        lines.append(f"| {idx} | {h['level']} | {h['stars']} {h['score']}/5 | {safe_text} | {verdict} |")

    # Summary stats
    avg = sum(h["score"] for h in headings) / len(headings)
    strong = sum(1 for h in headings if h["score"] >= 4)
    weak = sum(1 for h in headings if h["score"] <= 2)

    lines.append(f"")
    lines.append(f"**Summary:**")
    lines.append(f"- Average score: {'★' * round(avg)}{'☆' * (5 - round(avg))} {avg:.1f}/5")
    lines.append(f"- Strong headings (4-5/5): {strong}/{len(headings)}")
    lines.append(f"- Weak headings (1-2/5): {weak}/{len(headings)}")

    if weak > 0:
        lines.append(f"- 💡 **Tip:** Headings scoring 2 or below should be rewritten with stronger keywords or clearer intent.")

    return "\n".join(lines)


def _build_content_prompt(topic: str, content_type: str) -> str:
    return f"""
    Act as a SEO Specialist and Content Strategy Expert.
    
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
    [Write the actual content here, using proper H2s and H3s. Focus on EEAT, flow, and value.]
    
    IMPORTANT: In section 5, each heading MUST be annotated with a quality score marker.
    Format each heading like this:
    
    ## [H2] [★★★★☆ 4/5] Your Heading Text Here
    
    The marker format is: [H1], [H2], or [H3] for the heading level, followed by a score out of 5 with stars.
    
    Scoring criteria for headings:
    - 5/5 [★★★★★]: Excellent keyword relevance, clear intent, compelling, proper length (5-12 words), includes primary/semantic keyword naturally
    - 4/5 [★★★★☆]: Good relevance, clear intent, could be slightly more compelling or keyword-rich
    - 3/5 [★★★☆☆]: Decent but generic, missing keyword opportunity, or slightly too long/vague
    - 2/5 [★★☆☆☆]: Weak relevance, too vague, or doesn't match search intent well
    - 1/5 [★☆☆☆☆]: Poor, off-topic, or misleading heading
    
    Example of how section 5 should look like:
    
    ## [H2] [★★★★★ 5/5] Understanding the Fundamentals of {topic}
    
    Paragraph content here...
    
    ### [H3] [★★★★☆ 4/5] Why {topic} Matters in 2026
    
    Sub-content here...
    
    ### [H3] [★★★☆☆ 3/5] Things to Consider
    
    This heading is a bit generic — that's why it scores 3/5.
    
    ## [H2] [★★★★☆ 4/5] Best Practices and Strategies for {topic}
    
    More content here...
    
    # 6. FAQ Section
    - Use Schema-ready question formats.
    
    Also annotate FAQ questions the same way:
    ### [H3] [★★★★★ 5/5] What is {topic} and how does it work?

    ---
    RULES:
    - Use clear headings (#, ##, ###).
    - EVERY heading in section 5 and 6 MUST include the [H#] and [★★★★★ X/5] marker.
    - Use tables for keyword data.
    - Use bolding for emphasis.
    - Use lists for readability.
    - Maintain a professional, expert tone.
    - Focus on Semantic SEO (don't just repeat the keyword).
    """


def generate_content(topic, content_type):
    try:
        prompt = _build_content_prompt(topic, content_type)
        raw_content = generate_content_with_fallback(prompt)

        # Parse heading markers and append a scorecard
        headings = _parse_heading_markers(raw_content)
        if headings:
            scorecard = _heading_scorecard(headings, topic)
            return raw_content + "\n" + scorecard
        else:
            return raw_content
    except Exception as e:
        return f"Content AI Error: {str(e)}"


def run_content_arena(topic: str, content_type: str) -> dict:
    """
    Arena Mode: Generate content using multiple models/providers for comparison.
    Returns a dict keyed by provider name with the generated content.
    """
    from .gemini_service import (
        GEMINI_KEYS, OPENROUTER_KEY,
        get_gemini_model, generate_with_openrouter_model,
    )

    prompt = _build_content_prompt(topic, content_type)
    results = {}

    # --- Gemini (native SDK) ---
    try:
        model = get_gemini_model()
        if model:
            response = model.generate_content(prompt)
            results["gemini"] = response.text
        else:
            results["gemini"] = "Not configured"
    except Exception as e:
        results["gemini"] = f"Error: {str(e)}"

    # --- OpenRouter models (all use the same key) ---
    or_models = {
        # Google
        "or_gemini_flash": "google/gemini-2.0-flash-001",
        # Anthropic Claude
        "or_claude_sonnet": "anthropic/claude-sonnet-4",
        # DeepSeek
        "or_deepseek_chat": "deepseek/deepseek-chat",
        # OpenAI
        "or_gpt4o_mini": "openai/gpt-4o-mini",
    }

    for label, model_id in or_models.items():
        if OPENROUTER_KEY:
            try:
                result = generate_with_openrouter_model(prompt, model_id)
                results[label] = result if result else "No response"
            except Exception as e:
                results[label] = f"Error: {str(e)}"
        else:
            results[label] = "OpenRouter not configured"

    # --- OpenAI (native API, separate key) ---
    try:
        from .openai_service import generate_with_openai
        openai_res = generate_with_openai(prompt)
        results["openai_gpt4o_mini"] = openai_res if openai_res else "No response"
    except Exception as e:
        results["openai_gpt4o_mini"] = f"Error: {str(e)}"

    if not results:
        results["error"] = "No providers available."

    return results
