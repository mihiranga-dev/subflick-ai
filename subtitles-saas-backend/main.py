from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import whisper
import services
import math

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

def format_timestamp(seconds: float):
    """Converts seconds to SRT timestamp format"""
    hours = math.floor(seconds / 3600)
    seconds %= 3600
    minutes = math.floor(seconds / 60)
    seconds %= 60
    milliseconds = round((seconds - math.floor(seconds)) * 1000)
    seconds = math.floor(seconds)
    
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def generate_srt(segments):
    """Builds the SRT string from Whisper segments"""
    srt_content = ""
    for i, segment in enumerate(segments, start=1):
        start_time = format_timestamp(segment['start'])
        end_time = format_timestamp(segment['end'])
        text = segment['text'].strip()
        
        srt_content += f"{i}\n{start_time} --> {end_time}\n{text}\n\n"
    return srt_content

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
        original_srt = result["text"]
        
        # 4. Generate Original SRT
        print("Formatting original SRT...")
        original_srt = generate_srt(result["segments"])

        # 5. Translate (Gemini)
        # Note: We send the whole SRT to Gemini to preserve timing context
        print(f"Translating SRT content...")
        translated_srt = services.translate_text(original_srt, "Sinhala")
        
        return {
            "filename": file.filename,
            "original_srt": original_srt,
            "translated_srt": translated_srt
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