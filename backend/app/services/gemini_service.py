import google.generativeai as genai
import os
from dotenv import load_dotenv
from openai import OpenAI

# Search for .env in the backend directory specifically
base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
load_dotenv()  # Also load from current working directory

OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
if OPENROUTER_KEY:
    OPENROUTER_KEY = OPENROUTER_KEY.strip()
if OPENROUTER_KEY and OPENROUTER_KEY.startswith("ADD_YOUR"):
    OPENROUTER_KEY = None

current_gemini_index = 0


def get_openrouter_client():
    if not OPENROUTER_KEY:
        return None
    return OpenAI(api_key=OPENROUTER_KEY, base_url="https://openrouter.ai/api/v1")


def generate_with_openrouter(prompt: str) -> str:
    """Simple OpenRouter generation helper for diagnostic checks."""
    client = get_openrouter_client()
    if not client:
        return "OpenRouter Error: OPENROUTER_API_KEY missing or invalid."

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a reliable AI assistant."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenRouter Error: {str(e)}")
        return f"OpenRouter Error: {str(e)}"


def generate_with_openrouter_model(prompt: str, model_id: str) -> str:
    """OpenRouter generation helper for a specific model id."""
    client = get_openrouter_client()
    if not client:
        return "OpenRouter Error: OPENROUTER_API_KEY missing or invalid."

    try:
        response = client.chat.completions.create(
            model=model_id,
            messages=[
                {"role": "system", "content": "You are a professional SEO expert and content strategist."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenRouter Error ({model_id}): {str(e)}")
        return f"OpenRouter Error ({model_id}): {str(e)}"


def get_gemini_keys():
    """Returns a list of valid Gemini API keys from environment."""
    keys = [
        os.getenv("GEMINI_API_KEY"),
        os.getenv("GEMINI_API_KEY_BACKUP")
    ]
    valid_keys = [k.strip() for k in keys if k and not k.strip().startswith("ADD_YOUR")]
    print(f"DEBUG: Found {len(valid_keys)} valid Gemini keys in environment.")
    for i, k in enumerate(valid_keys):
        masked = k[:6] + "..." + k[-4:] if len(k) > 10 else "***"
        print(f"DEBUG: Key {i+1} masked: {masked}")
    return valid_keys

def get_gemini_model():
    """Configures and returns the Gemini model."""
    global current_gemini_index
    keys = get_gemini_keys()
    if not keys:
        print("DEBUG: No Gemini keys found.")
        return None
    
    current_gemini_index = current_gemini_index % len(keys)
    target_key = keys[current_gemini_index]
    print(f"DEBUG: Using Gemini Key Index {current_gemini_index} (Masked: {target_key[:4]}...)")
    
    try:
        genai.configure(api_key=target_key)
        return genai.GenerativeModel("gemini-2.0-flash")
    except Exception as e:
        print(f"DEBUG: Error configuring Gemini model: {str(e)}")
        return None

def generate_content_with_fallback(prompt: str) -> str:
    """
    Tiered Fallback logic:
    1. Primary Gemini Key
    2. Backup Gemini Key
    3. OpenAI (Primary Fallback)
    4. OpenRouter (Final Fallback)
    """
    global current_gemini_index
    
    # Tier 1: Gemini
    keys = get_gemini_keys()
    for i in range(len(keys)):
        try:
            model = get_gemini_model()
            if not model:
                print("DEBUG: Gemini model instantiation failed.")
                break
            
            print(f"DEBUG: Attempting generation with Gemini (Attempt {i+1})")
            response = model.generate_content(prompt)
            return response.text

        except Exception as e:
            error_str = str(e).lower()
            print(f"DEBUG: Gemini Exception: {str(e)}")
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str:
                print(f"Gemini API Key {current_gemini_index + 1} reported exhaustion. Trying next Gemini key...")
                current_gemini_index = (current_gemini_index + 1) % len(keys)
                continue
            else:
                print(f"Gemini AI Error: {str(e)}")
                break

    # Tier 2: OpenAI
    print("Gemini failed. Attempting OpenAI...")
    try:
        from .openai_service import generate_with_openai
        openai_res = generate_with_openai(prompt)
        if openai_res and not openai_res.startswith("OpenAI Error"):
            return openai_res
    except Exception as e:
        print(f"OpenAI Fallback Error: {str(e)}")

    # Tier 3: OpenRouter
    print("All primary providers failed. Attempting OpenRouter...")
    or_result = generate_with_openrouter(prompt)
    if or_result:
        return or_result

    # Tier 4: DeepSeek
    print("OpenRouter failed. Attempting DeepSeek...")
    try:
        from .deepseek_service import generate_deepseek_fallback
        deepseek_res = generate_deepseek_fallback(prompt)
        if deepseek_res:
            return deepseek_res
    except Exception as e:
        print(f"DeepSeek Fallback Error: {str(e)}")

    return "AI Error: All providers (Gemini, OpenAI, OpenRouter & DeepSeek) exhausted or failed."


GEMINI_KEYS = get_gemini_keys()


def generate_seo_recommendations(data):
    """Specific wrapper for SEO recommendations."""
    prompt = f"""
    Act as an expert SEO Specialist and semantic content Strategist
    
    TASK: Generate high - ranking SEO content based on the topic provided.
    
    DATA TO ANALYZE:
    {data}

    OUTPUT FORMAT:
    1. Analyze search intent
    2. Generate (in a Table):
        - primary key 
        - long - tail keywords
        - semantic keywords
        - question keywords
    3. Create:
        - SEO title
        - meta description
        - URL slug
        - H1 - H3 headings
        - SEO optimized article 
        - FAQ Section
    4. Optimize for:
        - EEAT
        - Semantic SEO 
        - Featured snippet
        - Readibility
        - topical authority

    RULES:
    - Use Markdown formatting.
    - Be concise but highly tactical.
    - Focus on semantic relevance and EEAT.
    - Use clear section headers.
    - Use natural human - like written 
    - avoid key stuffing & AI detection
    """
    return generate_content_with_fallback(prompt)

def generate_schema_markup(audit_data):
    """Generates JSON-LD schema markup based on audit data."""
    prompt = f"""
    Act as a Technical SEO Expert.
    
    TASK: Generate the most appropriate JSON-LD Schema Markup for the website based on the following audit data:
    {audit_data}
    
    OUTPUT:
    - Return ONLY the JSON-LD code block inside <script type="application/ld+json"> tags.
    - If it's a blog, use Article/BlogPosting. If it's a company site, use Organization/WebSite.
    - Include as much detail as possible from the provided data.
    """
    return generate_content_with_fallback(prompt)
