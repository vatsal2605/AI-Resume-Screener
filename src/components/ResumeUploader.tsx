import React from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ResumeFile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ResumeUploaderProps {
  resumes: ResumeFile[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
}

export function ResumeUploader({ resumes, onAddFiles, onRemoveFile }: ResumeUploaderProps) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <UploadCloud className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Upload Resumes</h2>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative"
      >
        <input
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <p className="text-sm text-slate-600 font-medium">
          Drag & drop resumes here, or click to select
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Supported formats: PDF, TXT
        </p>
      </div>

      <AnimatePresence>
        {resumes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {resume.file.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                  {resume.status === 'evaluating' && (
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  )}
                  {resume.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {resume.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  
                  <button
                    onClick={() => onRemoveFile(resume.id)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
