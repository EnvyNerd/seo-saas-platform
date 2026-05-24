import google.generativeai as genai
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# Gemini Config
GEMINI_KEYS = [
    os.getenv("GEMINI_API_KEY"),
    os.getenv("GEMINI_API_KEY_BACKUP")
]
GEMINI_KEYS = [k for k in GEMINI_KEYS if k and not k.startswith("ADD_YOUR")]

# OpenRouter Config
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY")
if OPENROUTER_KEY and OPENROUTER_KEY.startswith("ADD_YOUR"):
    OPENROUTER_KEY = None

current_gemini_index = 0

def get_gemini_model():
    """Configures and returns the Gemini model."""
    global current_gemini_index
    if not GEMINI_KEYS:
        return None
    
    genai.configure(api_key=GEMINI_KEYS[current_gemini_index])
    return genai.GenerativeModel("gemini-2.0-flash")

def generate_with_openrouter(prompt: str) -> str:
    """Fallback to OpenRouter (using deepseek or gpt-4o-mini)."""
    if not OPENROUTER_KEY:
        return None
    
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=OPENROUTER_KEY,
        )
        
        response = client.chat.completions.create(
            model="google/gemini-2.0-flash-001", # You can change this to "deepseek/deepseek-chat" etc.
            messages=[
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenRouter Error: {str(e)}")
        return None

def generate_content_with_fallback(prompt: str) -> str:
    """
    Tiered Fallback logic:
    1. Primary Gemini Key
    2. Backup Gemini Key
    3. OpenRouter (Final Fallback)
    """
    global current_gemini_index
    
    # Try Gemini Keys first
    for _ in range(len(GEMINI_KEYS)):
        try:
            model = get_gemini_model()
            if not model:
                break
            
            response = model.generate_content(prompt)
            return response.text

        except Exception as e:
            error_str = str(e).lower()
            if "429" in error_str or "quota" in error_str or "exhausted" in error_str:
                print(f"Gemini API Key {current_gemini_index + 1} exhausted. Trying next Gemini key...")
                current_gemini_index = (current_gemini_index + 1) % len(GEMINI_KEYS)
                continue
            else:
                print(f"Gemini AI Error: {str(e)}")
                break # Non-quota error, try OpenRouter immediately

    # Final Fallback: OpenRouter
    print("All Gemini keys exhausted or failed. Attempting OpenRouter...")
    or_result = generate_with_openrouter(prompt)
    if or_result:
        return or_result
    
    return "AI Error: All providers (Gemini & OpenRouter) exhausted or failed."

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
