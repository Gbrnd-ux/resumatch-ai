'use client';

import { useState } from 'react';
import { ResultCard } from '@/components/ResultCard';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      alert("Harap unggah CV dan isi Job Description!");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      setResult(data);
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">AI Resume Analyzer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* KOLOM KIRI: INPUT */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-slate-700">1. Upload CV (PDF)</label>
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-slate-700">2. Paste Job Description</label>
              <textarea 
                rows={8}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Tempel persyaratan lowongan di sini..."
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? 'Menganalisis dengan AI...' : 'Analyze Resume'}
            </button>
          </div>

          {/* KOLOM KANAN: HASIL / LOADING */}
          <div>
            {loading ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-blue-600 font-semibold text-lg">AI sedang membaca & menganalisis CV...</p>
                <p className="text-sm text-slate-400 mt-2">Mohon tunggu beberapa detik saja.</p>
              </div>
            ) : result ? (
              <ResultCard data={result} />
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400 bg-white/50">
                Hasil analisis akan muncul di sini
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
