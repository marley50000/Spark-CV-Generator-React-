
import React, { FC } from 'react';
import { AnalysisResult } from '../types';
import { ChartBarIcon, CheckCircleIcon, LightbulbIcon, XIcon } from './icons';

interface AnalysisModalProps {
  result: AnalysisResult;
  onClose: () => void;
}

const AnalysisModal: FC<AnalysisModalProps> = ({ result, onClose }) => {
  const { overallScore, scoreBreakdown, strengths, suggestions, keywordAnalysis } = result;

  const scoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const scoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[1000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
          <XIcon />
        </button>

        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">AI Document Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl">
                <p className="text-lg font-medium text-slate-600 mb-2">Overall Score</p>
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                        <path className="text-slate-200" strokeWidth="3" fill="none" stroke="currentColor" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={`transition-all duration-1000 ease-out ${scoreColor(overallScore)}`} strokeWidth="3" fill="none" stroke="currentColor" strokeDasharray={`${overallScore}, 100`} strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center text-5xl font-bold ${scoreColor(overallScore)}`}>
                        {overallScore}
                    </div>
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">This score reflects the document's relevance, impact, and clarity for the target job.</p>
            </div>

            <div className="space-y-4 my-auto">
                <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2"><ChartBarIcon /> Score Breakdown</h3>
                {scoreBreakdown.map(item => (
                    <div key={item.category}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-600">{item.category}</span>
                            <span className={`text-sm font-bold ${scoreColor(item.score)}`}>{item.score}/100</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className={`${scoreBgColor(item.score)} h-2.5 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${item.score}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-3"><span className="text-green-500"><CheckCircleIcon /></span> Strengths</h3>
                <ul className="space-y-2 list-inside">
                    {strengths.map((s, i) => <li key={i} className="text-slate-600 text-sm flex items-start gap-2"><span className="text-green-500 mt-1">&#8226;</span><span>{s}</span></li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-slate-700 flex items-center gap-2 mb-3"><span className="text-yellow-500"><LightbulbIcon /></span> Suggestions</h3>
                <ul className="space-y-2 list-inside">
                    {suggestions.map((s, i) => <li key={i} className="text-slate-600 text-sm flex items-start gap-2"><span className="text-yellow-500 mt-1">&#8226;</span><span>{s}</span></li>)}
                </ul>
            </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-700 mb-3">Keyword Analysis</h3>
            <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-4">Comparison between keywords in the job description and your document.</p>
                <div className="flex flex-wrap gap-2">
                    {keywordAnalysis.jobKeywords.map(keyword => {
                        const isMissing = keywordAnalysis.missingKeywords.includes(keyword);
                        return (
                            <span key={keyword} className={`px-3 py-1 text-xs font-medium rounded-full ${isMissing ? 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200' : 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200'}`}>
                                {keyword}
                            </span>
                        );
                    })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-200"></span> Found</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-200"></span> Missing</div>
                </div>
            </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalysisModal;
