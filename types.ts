
export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedIn: string;
  portfolio: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface CVData {
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
}

export interface CoverLetterData {
  recipientName: string;
  recipientCompany: string;
  recipientAddress: string;
  letterBody: string;
  date: string;
}

export enum Template {
  MODERN = 'Modern',
  CLASSIC = 'Classic',
}

export enum DocumentType {
  CV = 'CV',
  COVER_LETTER = 'Cover Letter',
}

export interface ScoreBreakdownItem {
  category: string;
  score: number;
}

export interface KeywordAnalysis {
  jobKeywords: string[];
  cvKeywords: string[];
  missingKeywords: string[];
}

export interface AnalysisResult {
  overallScore: number;
  scoreBreakdown: ScoreBreakdownItem[];
  strengths: string[];
  suggestions: string[];
  keywordAnalysis: KeywordAnalysis;
}

export interface StylingOptions {
  fontFamily: 'Inter' | 'Georgia' | 'Roboto Mono';
  fontSize: 'Small' | 'Medium' | 'Large';
  lineHeight: number;
  margin: 'Narrow' | 'Normal' | 'Wide';
}