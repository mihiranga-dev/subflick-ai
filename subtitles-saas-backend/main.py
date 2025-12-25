from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from groq import Groq
import services 
import math
from moviepy.editor import VideoFileClip
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException

load_dotenv()

app = FastAPI()

# Allow connections from anywhere
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "temp_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Groq Client
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

def extract_audio(video_path: str, output_audio_path: str):
    try:
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(output_audio_path, logger=None)
        video.close()
        return True
    except Exception as e:
        print(f"Error extracting audio: {e}")
        return False

def format_timestamp(seconds: float):
    hours = math.floor(seconds / 3600)
    seconds %= 3600
    minutes = math.floor(seconds / 60)
    seconds %= 60
    milliseconds = round((seconds - math.floor(seconds)) * 1000)
    seconds = math.floor(seconds)
    return f"{hours:02}:{minutes:02}:{seconds:02},{milliseconds:03}"

def generate_srt_from_groq(segments):
    srt_content = ""
    for i, segment in enumerate(segments, start=1):
        # FIX: Check if it's a Dictionary (cloud) or Object (local)
        if isinstance(segment, dict):
            start = segment.get('start', 0)
            end = segment.get('end', 0)
            text = segment.get('text', '').strip()
        else:
            start = segment.start
            end = segment.end
            text = segment.text.strip()

        start_time = format_timestamp(start)
        end_time = format_timestamp(end)
        
        srt_content += f"{i}\n{start_time} --> {end_time}\n{text}\n\n"
    return srt_content

@app.post("/transcribe")
async def upload_video(
    file: UploadFile = File(...),
    target_language: str = Form("Sinhala") # Default if not provided
):
    video_path = f"{UPLOAD_FOLDER}/{file.filename}"
    audio_filename = f"{os.path.splitext(file.filename)[0]}.mp3"
    audio_path = f"{UPLOAD_FOLDER}/{audio_filename}"
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # 1. Extract Audio
        print("Extracting audio...")
        if not extract_audio(video_path, audio_path):
            raise Exception("Audio extraction failed")
        
        # 2. Transcribe via Groq
        print("Sending to Groq API...")
        with open(audio_path, "rb") as file_obj:
            transcription = groq_client.audio.transcriptions.create(
                file=(audio_filename, file_obj.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        
        # 3. Process & Translate
        original_srt = generate_srt_from_groq(transcription.segments)
        translated_srt = services.translate_text(original_srt, target_language)
        
        return {
            "filename": file.filename,
            "original_srt": original_srt,
            "translated_srt": translated_srt
        }
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(video_path): os.remove(video_path)
        if os.path.exists(audio_path): 
            try: os.remove(audio_path)
            except: pass