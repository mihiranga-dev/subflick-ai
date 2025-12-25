import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def translate_text(text: str, target_language: str) -> str:
    """
    Uses the NEW Google Gen AI SDK (v1.0+) to translate SRT text.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Initialize the new client
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are a professional subtitle translator.
    
    Task:
    Translate the text content of the following SRT subtitle data into {target_language}.
    
    CRITICAL RULES:
    1. STRICTLY preserve the SRT format (Sequence numbers, Timestamps, and arrow '-->').
    2. ONLY translate the dialogue text. Do not translate timestamps.
    3. Do not add any conversational filler (e.g., "Here is the translation").
    4. Maintain the tone and context of the original video.

    Input SRT:
    {text}
    """
    
    # The new syntax for generating content
    response = client.models.generate_content(
        model='gemini-flash-latest',
        contents=prompt
    )
    
    return response.text.strip()