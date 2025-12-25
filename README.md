# 🎬 SubFlick AI

**AI-Powered Subtitle Generator & Translator (SaaS)**

![Project Status](https://img.shields.io/badge/Status-Live_MVP-success)
![Tech Stack](https://img.shields.io/badge/Stack-FastAPI_React_Groq_Gemini-blueviolet)
![Deployment](https://img.shields.io/badge/Deployed_on-Hugging_Face_%2B_Netlify-blue)

## 📖 Overview

**SubFlick AI** is a cloud-native SaaS platform that automates the process of creating and translating subtitles for video content.

Unlike traditional tools that require heavy local GPUs, SubFlick AI is built on a **serverless architecture**:

1.  **Groq Cloud API (Whisper Large v3):** Provides near-instant speech-to-text transcription (approx. 30x faster than real-time).
2.  **Google Gemini 1.5 Flash:** Handles context-aware translation into **60+ languages** (Sinhala, French, Spanish, etc.).

The application is containerized with Docker and hosted on **Hugging Face Spaces**, making it accessible from any device without requiring a powerful computer.

---

## ✨ Key Features

- **⚡ Blazing Fast:** Powered by Groq's LPU inference engine; transcribes 10-minute videos in seconds.
- **🌍 Multi-Language:** Supports translation into over 60 languages via Google Gemini.
- **📂 Industry Standard:** Auto-generates valid `.SRT` files with precise timestamps.
- **🛠 Bandwidth Optimized:** Automatically extracts audio from video client-side/server-side to minimize upload times.
- **☁️ Cloud Native:** No GPU required. Runs entirely on free-tier cloud infrastructure.

---

## 🛠 Tech Stack

### Frontend

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) **React + Vite**
- ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS**
- **Axios** (API Requests)

### Backend

- ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white) **Python 3.11**
- ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?logo=fastapi&logoColor=white) **FastAPI**
- **Docker** (Containerization for Hugging Face)
- **MoviePy** (Audio Extraction)

### AI Services

- **Groq API** (Whisper Large v3)
- **Google Gemini API** (Translation)

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js & npm
- API Keys:
  - **Groq API Key** (from [console.groq.com](https://console.groq.com))
  - **Gemini API Key** (from [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the Repository

git clone [https://github.com/mihiranga-dev/subflick-ai.git](https://github.com/mihiranga-dev/subflick-ai.git)
cd subflick-ai

### 2. Backend Setup

cd subtitles-saas-backend

- #### Create virtual environment

  python -m venv venv

- #### Activate (Windows)

  venv\Scripts\activate

- #### Activate (Mac/Linux)

  source venv/bin/activate

- #### Install dependencies

  pip install -r requirements.txt

- Configure Environment Variables:

  - Create a .env file in - subtitles-saas-backend/ and add:
    - GROQ_API_KEY=your_groq_key
    - GEMINI_API_KEY=your_gemini_key

- Run Server:
  uvicorn main:app --reload

### 3. Frontend Setup

- cd subtitles-saas-frontend
- npm install
- npm run dev

## 📦 Deployment Guide

### Backend (Hugging Face Spaces)

1. Create a new Space (Docker SDK).

2. Upload the subtitles-saas-backend files (Dockerfile, main.py, requirements.txt, etc.).

3. Add GROQ_API_KEY and GEMINI_API_KEY in Space Settings -> Secrets.

### Frontend (Netlify/Vercel)

1. Import the repository.

2. Set Root Directory to subtitles-saas-frontend.

3. Set Build Command to npm run build and Output Directory to dist.

4. Important: Update the API_URL in App.jsx to point to your live Hugging Face URL.

## 📄 License

Distributed under the MIT License.

## 👤 Author

- Mihiranga
- GitHub: @mihiranga-dev
