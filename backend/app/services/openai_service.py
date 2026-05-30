import os
from openai import OpenAI
from dotenv import load_dotenv

# Search for .env in the backend directory specifically
base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
load_dotenv() # Also load from current working directory

OPENAI_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_KEY and OPENAI_KEY.startswith("ADD_YOUR"):
    OPENAI_KEY = None

def get_openai_client():
    if not OPENAI_KEY:
        return None
    return OpenAI(api_key=OPENAI_KEY)

def generate_with_openai(prompt: str, model: str = "gpt-4o-mini") -> str:
    """
    Generates content using OpenAI API.
    """
    client = get_openai_client()
    if not client:
        return "OpenAI Error: API Key missing or invalid."
    
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a professional SEO expert and content strategist."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI Error: {str(e)}")
        return f"OpenAI Error: {str(e)}"
