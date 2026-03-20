import { FileText } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-slate-900">Job Description</h2>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-700"
      />
    </div>
  );
}
