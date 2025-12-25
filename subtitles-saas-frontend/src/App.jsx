import { useState } from 'react';
import axios from 'axios';
import { FileVideo, CheckCircle, AlertCircle, Download, FileText, Globe } from 'lucide-react';

// 1. Define the supported languages list
const LANGUAGES = [
  { code: "Afrikaans", name: "Afrikaans" },
  { code: "Albanian", name: "Albanian" },
  { code: "Amharic", name: "Amharic" },
  { code: "Arabic", name: "Arabic" },
  { code: "Armenian", name: "Armenian" },
  { code: "Bengali", name: "Bengali" },
  { code: "Bosnian", name: "Bosnian" },
  { code: "Bulgarian", name: "Bulgarian" },
  { code: "Catalan", name: "Catalan" },
  { code: "Chinese (Simplified)", name: "Chinese (Simplified)" },
  { code: "Chinese (Traditional)", name: "Chinese (Traditional)" },
  { code: "Croatian", name: "Croatian" },
  { code: "Czech", name: "Czech" },
  { code: "Danish", name: "Danish" },
  { code: "Dutch", name: "Dutch" },
  { code: "English", name: "English" },
  { code: "Estonian", name: "Estonian" },
  { code: "Finnish", name: "Finnish" },
  { code: "French", name: "French" },
  { code: "Georgian", name: "Georgian" },
  { code: "German", name: "German" },
  { code: "Greek", name: "Greek" },
  { code: "Gujarati", name: "Gujarati" },
  { code: "Hebrew", name: "Hebrew" },
  { code: "Hindi", name: "Hindi" },
  { code: "Hungarian", name: "Hungarian" },
  { code: "Icelandic", name: "Icelandic" },
  { code: "Indonesian", name: "Indonesian" },
  { code: "Italian", name: "Italian" },
  { code: "Japanese", name: "Japanese" },
  { code: "Kannada", name: "Kannada" },
  { code: "Kazakh", name: "Kazakh" },
  { code: "Khmer", name: "Khmer" },
  { code: "Korean", name: "Korean" },
  { code: "Latvian", name: "Latvian" },
  { code: "Lithuanian", name: "Lithuanian" },
  { code: "Malay", name: "Malay" },
  { code: "Malayalam", name: "Malayalam" },
  { code: "Marathi", name: "Marathi" },
  { code: "Nepali", name: "Nepali" },
  { code: "Norwegian", name: "Norwegian" },
  { code: "Persian", name: "Persian" },
  { code: "Polish", name: "Polish" },
  { code: "Portuguese", name: "Portuguese" },
  { code: "Punjabi", name: "Punjabi" },
  { code: "Romanian", name: "Romanian" },
  { code: "Russian", name: "Russian" },
  { code: "Serbian", name: "Serbian" },
  { code: "Sinhala", name: "Sinhala (Sinhalese)" },
  { code: "Slovak", name: "Slovak" },
  { code: "Slovenian", name: "Slovenian" },
  { code: "Spanish", name: "Spanish" },
  { code: "Swahili", name: "Swahili" },
  { code: "Swedish", name: "Swedish" },
  { code: "Tamil", name: "Tamil" },
  { code: "Telugu", name: "Telugu" },
  { code: "Thai", name: "Thai" },
  { code: "Turkish", name: "Turkish" },
  { code: "Ukrainian", name: "Ukrainian" },
  { code: "Urdu", name: "Urdu" },
  { code: "Vietnamese", name: "Vietnamese" },
  { code: "Welsh", name: "Welsh" },
  { code: "Zulu", name: "Zulu" },
];

function App() {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("Sinhala");
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setResult(null);
      setErrorMsg('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('file', file);
    // 2. Append the selected language to the request
    formData.append('target_language', language);

    try {
      setStatus('processing');
      const API_URL = "https://mihiranga-dev-subflick-api.hf.space"; 
      
      const response = await axios.post(`${API_URL}/transcribe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
      setStatus('done');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.response?.data?.detail || "Something went wrong.");
    }
  };

  const downloadFile = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            SubFlick AI
          </h1>
          <p className="text-slate-400">Generate and Translate Subtitles in Any Language</p>
        </div>

        {/* Upload Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 shadow-2xl">
          
          {/* File Input */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg p-10 hover:border-blue-500 transition-colors cursor-pointer relative mb-6">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <FileVideo className="w-12 h-12 text-slate-500 mb-4" />
            <p className="text-lg font-medium text-slate-300 text-center">
              {file ? (
                file.name
              ) : (
                <span className="flex flex-col items-center">
                  Click to select video
                  <span className="text-sm text-slate-500 font-normal mt-1">
                    (MP4, MKV, MOV supported)
                  </span>
                </span>
              )}
            </p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <Globe size={18} className="text-blue-400" />
              <span className="text-sm text-slate-400">Translate to:</span>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={handleUpload}
              disabled={!file || status === 'uploading' || status === 'processing'}
              className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                !file 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50'
              }`}
            >
              {status === 'uploading' && 'Uploading...'}
              {status === 'processing' && 'AI Translating...'}
              {status === 'idle' && 'Generate Subtitles'}
              {status === 'done' && <><CheckCircle size={20}/> Done!</>}
              {status === 'error' && 'Failed'}
            </button>
          </div>

          {status === 'error' && (
             <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg flex items-center gap-3 text-red-300">
                <AlertCircle size={20} />
                <span>{errorMsg}</span>
             </div>
          )}
        </div>

        {/* Results Section */}
        {status === 'done' && result && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
            
            {/* Original SRT */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                  <FileText size={18} className="text-blue-400"/> Original SRT
                </h3>
                <button 
                  onClick={() => downloadFile(result.original_srt, 'original.srt')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <Download size={14}/> Download
                </button>
              </div>
              <textarea 
                readOnly 
                value={result.original_srt}
                className="w-full h-96 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono text-slate-400 focus:outline-none resize-none"
              />
            </div>

            {/* Translated SRT */}
            <div className="bg-slate-900 border border-blue-900/30 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FileText size={18} className="text-purple-400"/> {language} Translation
                </h3>
                <button 
                  onClick={() => downloadFile(result.translated_srt, `subtitles_${language}.srt`)}
                  className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white shadow-lg shadow-blue-900/20 flex items-center gap-1 transition-colors"
                >
                  <Download size={14}/> Download
                </button>
              </div>
              <textarea 
                readOnly 
                value={result.translated_srt}
                className="w-full h-96 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm font-mono text-green-400 focus:outline-none resize-none"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;