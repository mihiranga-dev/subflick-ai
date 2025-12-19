import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Keys
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("API Key missing!")

genai.configure(api_key=api_key)

# Standard Flash model
model = genai.GenerativeModel('gemini-flash-latest')

def translate_text(text: str, target_language: str):
    try:
        # 5000 characters is roughly 2-3 minutes of talking.
        if len(text) > 5000:
            return (f"Video too long! The transcript has {len(text)} characters. "
                    "For this Free Tier demo, please keep videos under 3 minutes.")

        print(f"Sending {len(text)} characters to Google Gemini...")

        # Translating the content
        prompt = f"""
        You are a professional subtitle translator.
        Translate the following transcript into {target_language}.
        
        Rules:
        1. Keep the tone natural and conversational.
        2. Output ONLY the translated text. No explanations.
        3. Do not summarize; translate sentence by sentence.

        Transcript:
        "{text}"
        """

        response = model.generate_content(prompt)
        return response.text.strip()
    
    except Exception as e:
        return f"Error: {str(e)}"