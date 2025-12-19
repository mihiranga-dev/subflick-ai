# 🎬 SubFlick AI - Context-Aware Subtitle Translator

**SubFlick AI** is a full-stack application that automatically generates and translates subtitles for videos. It uses OpenAI's **Whisper** model for accurate speech-to-text transcription and Google's **Gemini AI** to translate the subtitles while preserving context and nuance (slang, idioms, cultural references).

![Project Status](https://img.shields.io/badge/Status-Prototype-orange)
![Python](https://img.shields.io/badge/Backend-FastAPI-green)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)

## ✨ Features

- **🎥 Video Transcription:** Locally processed using OpenAI Whisper (runs on GPU).
- **🧠 Contextual Translation:** Uses Google Gemini to translate subtitles into French (extensible to other languages).
- **⚡ Modern UI:** Built with React, Tailwind CSS, and Lucide Icons.
- **🚀 Real-time Processing:** Fast feedback loop with status indicators.

## 🛠️ Tech Stack

### Backend (Python)

- **Framework:** FastAPI
- **AI Models:** OpenAI Whisper (Base model), Google Gemini Flash
- **Tools:** Uvicorn, Python-Multipart

### Frontend (React)

- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js & npm
- A Google Gemini API Key
- NVIDIA GPU (Recommended for Whisper speed, but works on CPU)

## 1. Clone the Repository

- git clone [https://github.com/mihiranga-dev/subflick-ai.git](https://github.com/mihiranga-dev/subflick-ai.git)
- cd subflick-ai

## 2. Backend Setup

- Navigate to the backend folder and set up the virtual environment:
- cd subtitles-saas-backend
- python -m venv venv

### Activate Virtual Environment

#### Windows:

- venv\Scripts\activate

#### Mac/Linux:

- source venv/bin/activate

### Install the dependencies:

pip install fastapi uvicorn python-multipart python-dotenv google-generativeai openai-whisper

### Configuration: Create a .env file in the subtitles-saas-backend folder:

GEMINI_API_KEY=your_google_api_key_here

## 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

- cd subtitles-saas-frontend
- npm install

## 🏃‍♂️ Running the Application

You need to run the Backend and Frontend in separate terminals.

### Terminal 1 (Backend):

- cd subtitles-saas-backend
- venv\Scripts\activate
- uvicorn main:app --reload

### Terminal 2 (Frontend):

- cd subtitles-saas-frontend
- npm run dev

Open your browser and navigate to the link shown (usually http://localhost:5173)
