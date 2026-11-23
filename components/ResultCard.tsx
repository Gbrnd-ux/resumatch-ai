'use client';

import { useState } from 'react';

interface ActionPlanItem {
  priority: 'Tinggi' | 'Sedang';
  skill: string;
  whyItMatters: string;
  howToLearn: string;
  estimatedTime: string;
}

interface InterviewTipItem {
  question: string;
  answerStrategy: string;
}

interface CategoryScores {
  technicalSkills?: number;
  experienceFit?: number;
  educationAndCulture?: number;
}

interface ResultData {
  matchScore: number;
  potentialScore?: number;
  summary?: string;
  categoryScores?: CategoryScores;
  matchingSkills: string[];
  missingSkills: string[];
  actionPlan?: ActionPlanItem[];
  improvementTips?: string[]; // Backward compatibility
  cvBulletPointsToAdd?: string[];
  interviewTips?: InterviewTipItem[];
}

export function ResultCard({ data }: { data: ResultData }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'cv' | 'interview'>('overview');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyFullReport = () => {
    const reportText = `=== LAPORAN EVALUASI RESUME AI ===
Skor Kesesuaian: ${data.matchScore}/100 (Potensi Peningkatan: ${data.potentialScore || data.matchScore + 20}/100)

RINGKASAN HRD:
${data.summary || '-'}

KEAHLIAN COCOK:
${data.matchingSkills?.join(', ')}

KEAHLIAN YANG PERLU DITAMBAHKAN:
${data.missingSkills?.join(', ')}

ROADMAP TINDAKAN:
${data.actionPlan?.map((p) => `• [Prioritas ${p.priority}] ${p.skill} (Estimasi: ${p.estimatedTime})\n  Solusi: ${p.howToLearn}`).join('\n\n') || '-'}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      {/* 1. Header Card with Score & Potential */}
      <div className="p-6 sm:p-7 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
              AI ATS Evaluation
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">Hasil Analisis Kesesuaian CV</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-4 py-1.5 rounded-full border text-lg font-extrabold ${getScoreColor(data.matchScore)}`}>
              {data.matchScore} / 100
            </div>
          </div>
        </div>

        {/* Progress Bar & Potential Badge */}
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${getBarColor(data.matchScore)}`}
              style={{ width: `${Math.min(Math.max(data.matchScore, 5), 100)}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Tingkat kesesuaian saat ini: <strong>{data.matchScore}%</strong></span>
            {data.potentialScore && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🚀 Potensi Peningkatan: {data.potentialScore}%
              </span>
            )}
          </div>
        </div>

        {/* Breakdown Skor Kategori */}
        {data.categoryScores && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Keahlian Teknis</span>
              <span className="font-bold text-slate-800 text-sm">{data.categoryScores.technicalSkills || data.matchScore}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Kesesuaian Role</span>
              <span className="font-bold text-slate-800 text-sm">{data.categoryScores.experienceFit || data.matchScore}%</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-500 block">Kualifikasi & Edukasi</span>
              <span className="font-bold text-slate-800 text-sm">{data.categoryScores.educationAndCulture || 90}%</span>
            </div>
          </div>
        )}

        {/* Quick Action Toolbar */}
        <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <button
            onClick={handleCopyFullReport}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center gap-1.5"
          >
            <span>📋</span> {copiedSummary ? 'Laporan Tersalin!' : 'Salin Laporan'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition flex items-center gap-1.5"
          >
            <span>🖨️</span> Cetak / PDF
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex border-b border-slate-200 px-4 bg-slate-50/70 overflow-x-auto text-xs font-semibold text-slate-600 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          📌 Ringkasan & Skill
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          🚀 Roadmap Belajar ({data.actionPlan?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('cv')}
          className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'cv'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          📝 Optimasi CV ({data.cvBulletPointsToAdd?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`py-3 px-3.5 border-b-2 transition whitespace-nowrap ${
            activeTab === 'interview'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          🎯 Jawaban Interview ({data.interviewTips?.length || 0})
        </button>
      </div>

      {/* 3. Tab Contents */}
      <div className="p-6 sm:p-7 space-y-6">
        {/* TAB 1: OVERVIEW & SKILLS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {data.summary && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900 block mb-1">📌 Evaluasi HRD:</span>
                {data.summary}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <h3 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-1.5">
                  <span>✅</span> Keahlian yang Cocok ({data.matchingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.matchingSkills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
                <h3 className="font-bold text-rose-800 text-sm mb-3 flex items-center gap-1.5">
                  <span>❌</span> Keahlian yang Kurang ({data.missingSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.missingSkills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-medium rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Teaser CTA to Roadmap */}
            {data.actionPlan && data.actionPlan.length > 0 && (
              <div
                onClick={() => setActiveTab('roadmap')}
                className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer flex items-center justify-between text-xs text-blue-900"
              >
                <span>💡 Ditemukan <strong>{data.actionPlan.length} langkah aksi</strong> untuk menaikkan skor Anda.</span>
                <span className="font-bold text-blue-600 underline">Lihat Roadmap ➡️</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROADMAP BELAJAR SEGERA */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Roadmap & Panduan Praktis</h3>
                <p className="text-xs text-slate-500">Langkah nyata menambal gap keahlian tercepat</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                {data.actionPlan?.length || 0} Target
              </span>
            </div>

            <div className="space-y-3">
              {data.actionPlan?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          item.priority === 'Tinggi'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        Prioritas {item.priority}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm">{item.skill}</h4>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium">
                      ⏱️ {item.estimatedTime}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-700 font-semibold">Mengapa krusial:</strong> {item.whyItMatters}
                  </p>

                  <div className="text-xs bg-blue-50/70 text-blue-900 p-3 rounded-lg border border-blue-100">
                    <strong className="font-semibold block mb-0.5 text-blue-950">Solusi & Cara Belajar:</strong>
                    {item.howToLearn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OPTIMASI CV BULLET POINTS */}
        {activeTab === 'cv' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Contoh Kalimat Pengalaman Kerja (ATS-Ready)</h3>
              <p className="text-xs text-slate-500">
                Klik kalimat untuk langsung menyalin ke clipboard, lalu tempelkan di portofolio atau CV Anda.
              </p>
            </div>

            <div className="space-y-2.5">
              {data.cvBulletPointsToAdd?.map((bullet, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(bullet, idx)}
                  className="group relative p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer transition text-xs text-slate-700 leading-relaxed flex items-start justify-between gap-3 shadow-xs"
                >
                  <span>• {bullet}</span>
                  <span className="shrink-0 text-[11px] font-semibold text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition">
                    {copiedIndex === idx ? '✓ Tersalin!' : 'Salin'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CHEAT SHEET INTERVIEW */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Strategi Menjawab Pertanyaan Skrining</h3>
              <p className="text-xs text-slate-500">
                Trik menjawab pertanyaan HRD terkait keahlian yang belum sepenuhnya Anda kuasai.
              </p>
            </div>

            <div className="space-y-3">
              {data.interviewTips?.map((tip, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 text-xs space-y-1.5">
                  <p className="font-bold text-amber-950">Q: "{tip.question}"</p>
                  <p className="text-slate-700 leading-relaxed">
                    <span className="font-semibold text-emerald-800">Strategi Menjawab:</span> {tip.answerStrategy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
