from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import whisper
import services 

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load model on GPU
print("Loading Whisper AI model on RTX 3060... (This might take a moment)")
# 'device="cuda"' - uses for GPU
model = whisper.load_model("base", device="cuda") 
print("Model loaded and ready!")

@app.post("/transcribe")
async def upload_video(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_FOLDER}/{file.filename}"
    
    # 1. Save File
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # 2. Check if file actually saved
    file_size = os.path.getsize(file_path)
    print(f"Saved file: {file.filename} | Size: {file_size} bytes")
    
    if file_size == 0:
        return {"error": "File is empty. Upload failed."}

    try:
        # 3. Transcribe (GPU)
        print(f"Transcribing {file.filename}...")
        result = model.transcribe(file_path)
        original_text = result["text"]
        
        # 4. Translate (Gemini)
        print(f"Translating content ({len(original_text)} chars)...")
        translated_text = services.translate_text(original_text, "Sinhala")
        
        return {
            "filename": file.filename,
            "original_transcript": original_text,
            "translated_subtitles": translated_text
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        # Print full error for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up
        if os.path.exists(file_path):
            os.remove(file_path)