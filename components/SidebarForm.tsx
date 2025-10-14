
import React, { FC, useState } from 'react';
import { CVData, CoverLetterData, Template, DocumentType, AnalysisResult, StylingOptions } from '../types';
import { generateSummary, generateCoverLetter, analyzeDocument } from '../services/geminiService';
import { BriefcaseIcon, GraduationCapIcon, LightbulbIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon, LinkIcon, SparklesIcon, ChevronDownIcon, ChartBarIcon, TextSizeIcon } from './icons';

interface SidebarFormProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  coverLetterData: CoverLetterData;
  setCoverLetterData: React.Dispatch<React.SetStateAction<CoverLetterData>>;
  jobDescription: string;
  setJobDescription: React.Dispatch<React.SetStateAction<string>>;
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  documentType: DocumentType;
  setDocumentType: React.Dispatch<React.SetStateAction<DocumentType>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAnalysisResult: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;
  stylingOptions: StylingOptions;
  setStylingOptions: React.Dispatch<React.SetStateAction<StylingOptions>>;
}

const SidebarForm: FC<SidebarFormProps> = ({
  cvData, setCvData, coverLetterData, setCoverLetterData, jobDescription, setJobDescription, template, setTemplate, documentType, setDocumentType, isLoading, setIsLoading, setAnalysisResult, stylingOptions, setStylingOptions
}) => {
  
    const handleGenerateSummary = async () => {
        setIsLoading(true);
        const summary = await generateSummary(cvData, jobDescription);
        setCvData(prev => ({ ...prev, summary }));
        setIsLoading(false);
    };

    const handleGenerateCoverLetter = async () => {
        setIsLoading(true);
        const letterBody = await generateCoverLetter(cvData, coverLetterData, jobDescription);
        setCoverLetterData(prev => ({ ...prev, letterBody }));
        setIsLoading(false);
    };

    const handleAnalyzeDocument = async () => {
        setIsLoading(true);
        setAnalysisResult(null);
        const result = await analyzeDocument(cvData, documentType, jobDescription, coverLetterData);
        if (result) {
            setAnalysisResult(result);
        } else {
            console.error("Failed to get analysis result.");
            // Ideally, show a notification to the user
        }
        setIsLoading(false);
    };
    
    const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            personalDetails: { ...prev.personalDetails, [name]: value }
        }));
    };
    
    const handleCvDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({ ...prev, [name]: value }));
    }

    const handleCoverLetterDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCoverLetterData(prev => ({ ...prev, [name]: value }));
    };

    const handleExperienceChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [name]: value } : exp)
        }));
    };

    const addExperience = () => {
        setCvData(prev => ({
            ...prev,
            experience: [...prev.experience, { id