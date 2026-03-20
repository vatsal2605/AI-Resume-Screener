import { useState } from 'react';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ResumeUploader } from './components/ResumeUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ResumeFile, CandidateEvaluation } from './types';
import { evaluateResume } from './services/geminiService';
import { BrainCircuit, Play, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFiles = (files: FileList | File[]) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: 'pending' as const,
    }));
    setResumes((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleEvaluate = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }

    const pendingResumes = resumes.filter((r) => r.status === 'pending' || r.status === 'error');
    if (pendingResumes.length === 0) {
      setError('Please add resumes to evaluate.');
      return;
    }

    setError(null);
    setIsEvaluating(true);

    for (const resume of pendingResumes) {
      setResumes((prev) =>
        prev.map((r) => (r.id === resume.id ? { ...r, status: 'evaluating' } : r))
      );

      try {
        const evaluation = await evaluateResume(jobDescription, resume.file);
        evaluation.id = resume.id;
        evaluation.fileName = resume.file.name;

        setResumes((prev) =>
          prev.map((r) =>
            r.id === resume.id ? { ...r, status: 'completed', evaluation } : r
          )
        );
      } catch (err) {
        console.error('Error evaluating resume:', err);
        setResumes((prev) =>
          prev.map((r) =>
            r.id === resume.id
              ? { ...r, status: 'error', error: err instanceof Error ? err.message : 'Unknown error' }
              : r
          )
        );
      }
    }

    setIsEvaluating(false);
  };

  const completedEvaluations = resumes
    .filter((r) => r.status === 'completed' && r.evaluation)
    .map((r) => r.evaluation as CandidateEvaluation);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              AI Resume Screener
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />
            <ResumeUploader
              resumes={resumes}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || resumes.length === 0 || !jobDescription.trim()}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Evaluating Resumes...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Analyze Candidates
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {completedEvaluations.length > 0 ? (
              <ResultsDisplay evaluations={completedEvaluations} />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-2xl">
                <BrainCircuit className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Results Yet</h3>
                <p className="text-slate-500 max-w-sm">
                  Add a job description and upload resumes, then click "Analyze Candidates" to see the AI evaluation results here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
