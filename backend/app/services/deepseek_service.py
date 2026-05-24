import httpx
import os

DEEPSEEK_BASE_URL = "https://api.deepseek.com"


def _get_deepseek_api_key() -> str:
    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise ValueError("DEEPSEEK_API_KEY environment variable is not set")
    return api_key


def _generate_deepseek_response(prompt: str, temperature: float = 0.7, max_tokens: int = 1500) -> str:
    api_key = _get_deepseek_api_key()
    url = f"{DEEPSEEK_BASE_URL}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    response = httpx.post(url, json=payload, headers=headers, timeout=60)
    response.raise_for_status()
    data = response.json()

    return data["choices"][0]["message"]["content"]


def generate_deepseek_content(topic: str):
    prompt = f"""
    Write an SEO optimized article about:

    {topic}

    Include:
    - SEO title
    - Meta description
    - Headings
    - Keyword optimization
    - Conclusion
    """
    return _generate_deepseek_response(prompt)


def generate_deepseek_fallback(prompt: str):
    return _generate_deepseek_response(prompt)


def should_use_deepseek_fallback(error: Exception) -> bool:
    text = str(error).lower()
    return any(keyword in text for keyword in [
        "limit",
        "quota",
        "request",
        "prompt",
        "token",
        "exceed",
        "context length",
        "too large",
        "rate limit",
        "forbidden"
    ])
