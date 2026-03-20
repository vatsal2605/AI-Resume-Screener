import { CandidateEvaluation } from '../types';
import { motion } from 'motion/react';
import { User, CheckCircle, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface ResultsDisplayProps {
  evaluations: CandidateEvaluation[];
}

export function ResultsDisplay({ evaluations }: ResultsDisplayProps) {
  const sortedEvaluations = [...evaluations].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Candidate Rankings</h2>
      <div className="grid gap-6">
        {sortedEvaluations.map((evalData, index) => (
          <CandidateCard key={evalData.id} evaluation={evalData} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

const CandidateCard: React.FC<{ evaluation: CandidateEvaluation; rank: number }> = ({ evaluation, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'Strong Fit':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Moderate Fit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Not Fit':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div 
        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shrink-0">
              #{rank}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                {evaluation.candidateName}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                <FileText className="w-4 h-4" />
                {evaluation.fileName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRecommendationBadge(evaluation.recommendation)}`}>
              {evaluation.recommendation}
            </span>
            <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 font-bold text-xl ${getScoreColor(evaluation.matchScore)}`}>
              {evaluation.matchScore}
            </div>
            {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden border-t border-slate-100"
      >
        <div className="p-6 bg-slate-50 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-emerald-800 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {evaluation.keyStrengths.map((strength, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-red-800 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Key Gaps
              </h4>
              <ul className="space-y-2">
                {evaluation.keyGaps.map((gap, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2 mt-2 p-4 bg-white rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">AI Reasoning</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              {evaluation.reasoning}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
