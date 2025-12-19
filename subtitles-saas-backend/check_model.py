import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load API key
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Contacting Google to list your available models...\n")

try:
    # List all models available to your specific API Key
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ Found: {m.name}")
            
except Exception as e:
    print(f"❌ Error: {e}")