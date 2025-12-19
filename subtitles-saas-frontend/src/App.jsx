import { useState } from 'react';
import axios from 'axios';
import { Upload, FileVideo, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setResult(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send video to your Python Backend
      const response = await axios.post('http://127.0.0.1:8000/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setResult(response.data);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.detail || 'Connection failed. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-4xl w-full bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">SubFlick AI</h1>
          <p className="text-indigo-100 mt-2 text-lg">Upload a video. Get French subtitles instantly.</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          
          {/* Upload Box */}
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-10 flex flex-col items-center justify-center transition hover:border-indigo-400 bg-slate-800/50 group cursor-pointer relative">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
            <div className="bg-slate-700 p-4 rounded-full mb-4 group-hover:bg-indigo-600 transition">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-medium text-slate-200">Click to upload video</p>
            <p className="text-sm text-slate-500 mt-2">MP4, MOV, or WebM (Max 2 mins for demo)</p>
          </div>

          {/* Status Bar */}
          {file && (
            <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between border border-slate-600">
              <div className="flex items-center space-x-3 overflow-hidden">
                <FileVideo className="text-indigo-400 flex-shrink-0" />
                <span className="truncate text-slate-200 font-mono text-sm">{file.name}</span>
              </div>
              
              {status === 'idle' && (
                <button 
                  onClick={handleUpload}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-semibold transition shadow-lg shadow-indigo-500/20"
                >
                  Start Processing
                </button>
              )}
              
              {(status === 'uploading') && (
                <div className="flex items-center text-indigo-300 animate-pulse">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  <span className="font-medium">AI is watching & translating...</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg flex items-start space-x-3 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Area */}
          {status === 'success' && result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* English Transcript */}
              <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-xs uppercase font-bold mb-3 tracking-wider">Original Audio</h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result.original_transcript}</p>
              </div>

              {/* French Translation */}
              <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle className="w-24 h-24 text-indigo-500" />
                </div>
                <h3 className="text-indigo-400 text-xs uppercase font-bold mb-3 tracking-wider flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Sinhala Subtitles
                </h3>
                <p className="text-white text-base leading-relaxed font-medium whitespace-pre-wrap">{result.translated_subtitles}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;