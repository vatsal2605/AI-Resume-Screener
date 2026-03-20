import { GoogleGenAI, Type } from "@google/genai";
import { CandidateEvaluation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function evaluateResume(
  jobDescription: string,
  resumeFile: File
): Promise<CandidateEvaluation> {
  const base64Data = await fileToBase64(resumeFile);
  const mimeType = resumeFile.type || 'application/pdf';

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        {
          text: `You are an expert technical recruiter and HR professional. 
          Evaluate the provided resume against the following Job Description.
          
          Job Description:
          ${jobDescription}
          
          Analyze the candidate's fit based on their skills, experience, and qualifications.
          Provide a match score from 0 to 100.
          Identify 2-3 key strengths that make them a good fit.
          Identify 2-3 key gaps or areas where they fall short of the requirements.
          Provide a final recommendation: "Strong Fit", "Moderate Fit", or "Not Fit".
          Provide a brief reasoning for your score and recommendation.
          Extract the candidate's name from the resume. If not found, use "Unknown Candidate".`
        },
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          candidateName: {
            type: Type.STRING,
            description: "The name of the candidate extracted from the resume."
          },
          matchScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 indicating how well the candidate matches the job description."
          },
          keyStrengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 key strengths of the candidate relative to the JD."
          },
          keyGaps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 key gaps or missing qualifications relative to the JD."
          },
          recommendation: {
            type: Type.STRING,
            description: "Final recommendation: 'Strong Fit', 'Moderate Fit', or 'Not Fit'."
          },
          reasoning: {
            type: Type.STRING,
            description: "Brief reasoning for the score and recommendation."
          }
        },
        required: ["candidateName", "matchScore", "keyStrengths", "keyGaps", "recommendation", "reasoning"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  try {
    const result = JSON.parse(text);
    return result as CandidateEvaluation;
  } catch (e) {
    throw new Error("Failed to parse Gemini response as JSON");
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:mime/type;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}
