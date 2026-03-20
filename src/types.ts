export interface CandidateEvaluation {
  id: string;
  candidateName: string;
  matchScore: number;
  keyStrengths: string[];
  keyGaps: string[];
  recommendation: 'Strong Fit' | 'Moderate Fit' | 'Not Fit';
  reasoning: string;
  fileName: string;
}

export interface ResumeFile {
  id: string;
  file: File;
  previewUrl?: string;
  status: 'pending' | 'evaluating' | 'completed' | 'error';
  evaluation?: CandidateEvaluation;
  error?: string;
}
