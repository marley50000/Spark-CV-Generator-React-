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

const CollapsibleSection: FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-200 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <span className="text-[var(--primary)]">{icon}</span>
                    <span>{title}</span>
                </div>
                <ChevronDownIcon className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4 bg-white border-t border-slate-200">{children}</div>}
        </div>
    );
};


const InputField: FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon?: React.ReactNode, placeholder?: string, type?: string }> = ({ label, name, value, onChange, icon, placeholder, type="text" }) => (
    <div className="mb-4 last:mb-0">
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-ring)] focus:border-[var(--primary-ring)] sm:text-sm ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

const TextareaField: FC<{ label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number, placeholder?: string }> = ({ label, name, value, onChange, rows = 4, placeholder }) => (
    <div className="mb-4 last:mb-0">
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-ring)] focus:border-[var(--primary-ring)] sm:text-sm"
        />
    </div>
);

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
            experience: [...prev.experience, {
                id: `exp-${Date.now()}`,
                jobTitle: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                description: '',
            }]
        }));
    };

    const removeExperience = (id: string) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };

    const handleEducationChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCvData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [name]: value } : edu)
        }));
    };
    
    const addEducation = () => {
        setCvData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: `edu-${Date.now()}`,
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
            }]
        }));
    };

    const removeEducation = (id: string) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCvData(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()) }));
    };

    const handleStylingChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setStylingOptions(prev => ({
            ...prev,
            [name]: name === 'lineHeight' ? parseFloat(value) : value,
        }));
    };

    return (
        <aside className="w-full bg-slate-100 p-6 overflow-y-auto h-screen max-h-screen border-r border-slate-200">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <CollapsibleSection title="Configuration" icon={<SparklesIcon />} defaultOpen>
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-600 mb-2">Document Type</label>
                        <div className="flex items-center p-1 bg-slate-100 rounded-lg space-x-1">
                            {(Object.values(DocumentType)).map(type => (
                                <button key={type} onClick={() => setDocumentType(type)} className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-ring)] ${documentType === type ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <TextareaField
                        label="Target Job Description"
                        name="jobDescription"
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        rows={6}
                        placeholder="Paste the job description here to tailor your document."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                         {documentType === DocumentType.CV && (
                            <button onClick={handleGenerateSummary} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[var(--primary-light)] text-[var(--primary-text-dark)] font-semibold py-2 px-4 rounded-lg hover:bg-[var(--primary-border)] transition-colors disabled:opacity-50">
                                <SparklesIcon /> Generate Summary
                            </button>
                        )}
                        {documentType === DocumentType.COVER_LETTER && (
                            <button onClick={handleGenerateCoverLetter} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-[var(--primary-light)] text-[var(--primary-text-dark)] font-semibold py-2 px-4 rounded-lg hover:bg-[var(--primary-border)] transition-colors disabled:opacity-50">
                                <SparklesIcon /> Generate Letter
                            </button>
                        )}
                        <button onClick={handleAnalyzeDocument} disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 col-span-full sm:col-span-1">
                            <ChartBarIcon /> Analyze
                        </button>
                    </div>
                </CollapsibleSection>

                 <CollapsibleSection title="Styling" icon={<TextSizeIcon />}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fontFamily" className="block text-sm font-medium text-slate-600 mb-1">Font Family</label>
                            <select id="fontFamily" name="fontFamily" value={stylingOptions.fontFamily} onChange={handleStylingChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-ring)] focus:border-[var(--primary-ring)] sm:text-sm">
                                <option>Inter</option>
                                <option>Georgia</option>
                                <option>Roboto Mono</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="fontSize" className="block text-sm font-medium text-slate-600 mb-1">Font Size</label>
                            <select id="fontSize" name="fontSize" value={stylingOptions.fontSize} onChange={handleStylingChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-ring)] focus:border-[var(--primary-ring)] sm:text-sm">
                                <option>Small</option>
                                <option>Medium</option>
                                <option>Large</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="margin" className="block text-sm font-medium text-slate-600 mb-1">Margin</label>
                            <select id="margin" name="margin" value={stylingOptions.margin} onChange={handleStylingChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary-ring)] focus:border-[var(--primary-ring)] sm:text-sm">
                                <option>Narrow</option>
                                <option>Normal</option>
                                <option>Wide</option>
                            </select>
                        </div>
                    </div>
                     <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                             <label htmlFor="lineHeight" className="block text-sm font-medium text-slate-600">Line Height</label>
                             <span className="text-sm text-slate-500 font-mono">{stylingOptions.lineHeight.toFixed(1)}</span>
                        </div>
                        <input
                            id="lineHeight"
                            name="lineHeight"
                            type="range"
                            min="1.2"
                            max="3.0"
                            step="0.1"
                            value={stylingOptions.lineHeight}
                            onChange={handleStylingChange}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                        />
                    </div>
                </CollapsibleSection>


                {documentType === DocumentType.CV ? (
                    <>
                        <CollapsibleSection title="Personal Details" icon={<UserIcon />}>
                            <InputField label="Full Name" name="fullName" value={cvData.personalDetails.fullName} onChange={handlePersonalDetailsChange} icon={<UserIcon />} />
                            <InputField label="Job Title" name="jobTitle" value={cvData.personalDetails.jobTitle} onChange={handlePersonalDetailsChange} icon={<BriefcaseIcon />} />
                            <InputField label="Email" name="email" type="email" value={cvData.personalDetails.email} onChange={handlePersonalDetailsChange} icon={<MailIcon />} />
                            <InputField label="Phone Number" name="phoneNumber" value={cvData.personalDetails.phoneNumber} onChange={handlePersonalDetailsChange} icon={<PhoneIcon />} />
                            <InputField label="Address" name="address" value={cvData.personalDetails.address} onChange={handlePersonalDetailsChange} icon={<MapPinIcon />} />
                            <InputField label="LinkedIn" name="linkedIn" value={cvData.personalDetails.linkedIn} onChange={handlePersonalDetailsChange} icon={<LinkIcon />} placeholder="linkedin.com/in/username" />
                            <InputField label="Portfolio" name="portfolio" value={cvData.personalDetails.portfolio} onChange={handlePersonalDetailsChange} icon={<LinkIcon />} placeholder="yourwebsite.dev" />
                        </CollapsibleSection>

                        <CollapsibleSection title="Professional Summary" icon={<LightbulbIcon />}>
                           <TextareaField label="Summary" name="summary" value={cvData.summary} onChange={handleCvDataChange} rows={5} />
                        </CollapsibleSection>

                        <CollapsibleSection title="Work Experience" icon={<BriefcaseIcon />}>
                            {cvData.experience.map((exp) => (
                                <div key={exp.id} className="p-3 mb-4 border rounded-md bg-slate-50 relative">
                                    <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs">Remove</button>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <InputField label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={e => handleExperienceChange(exp.id, e)} />
                                        <InputField label="Company" name="company" value={exp.company} onChange={e => handleExperienceChange(exp.id, e)} />
                                        <InputField label="Location" name="location" value={exp.location} onChange={e => handleExperienceChange(exp.id, e)} />
                                        <InputField label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(exp.id, e)} />
                                        <InputField label="End Date" name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(exp.id, e)} />
                                    </div>
                                    <TextareaField label="Description" name="description" value={exp.description} onChange={e => handleExperienceChange(exp.id, e)} rows={3} />
                                </div>
                            ))}
                            <button onClick={addExperience} className="w-full text-sm font-medium text-[var(--primary)] py-2 rounded-md hover:bg-[var(--primary-light)] transition-colors">
                                + Add Experience
                            </button>
                        </CollapsibleSection>
                        
                        <CollapsibleSection title="Education" icon={<GraduationCapIcon />}>
                             {cvData.education.map((edu) => (
                                <div key={edu.id} className="p-3 mb-4 border rounded-md bg-slate-50 relative">
                                    <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-xs">Remove</button>
                                    <div className="grid grid-cols-2 gap-x-4">
                                        <InputField label="Institution" name="institution" value={edu.institution} onChange={e => handleEducationChange(edu.id, e)} />
                                        <InputField label="Degree" name="degree" value={edu.degree} onChange={e => handleEducationChange(edu.id, e)} />
                                        <InputField label="Field of Study" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleEducationChange(edu.id, e)} />
                                        <InputField label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleEducationChange(edu.id, e)} />
                                        <InputField label="End Date" name="endDate" value={edu.endDate} onChange={e => handleEducationChange(edu.id, e)} />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="w-full text-sm font-medium text-[var(--primary)] py-2 rounded-md hover:bg-[var(--primary-light)] transition-colors">
                                + Add Education
                            </button>
                        </CollapsibleSection>

                        <CollapsibleSection title="Skills" icon={<LightbulbIcon />}>
                            <InputField 
                                label="Skills (comma separated)" 
                                name="skills" 
                                value={cvData.skills.join(', ')} 
                                onChange={handleSkillsChange}
                                placeholder="React, TypeScript, Next.js..."
                            />
                        </CollapsibleSection>
                    </>
                ) : (
                    <CollapsibleSection title="Cover Letter Details" icon={<MailIcon />}>
                        <InputField label="Recipient Name" name="recipientName" value={coverLetterData.recipientName} onChange={handleCoverLetterDataChange} />
                        <InputField label="Recipient Company" name="recipientCompany" value={coverLetterData.recipientCompany} onChange={handleCoverLetterDataChange} />
                        <InputField label="Recipient Address" name="recipientAddress" value={coverLetterData.recipientAddress} onChange={handleCoverLetterDataChange} />
                        <TextareaField label="Letter Body" name="letterBody" value={coverLetterData.letterBody} onChange={handleCoverLetterDataChange} rows={15} />
                    </CollapsibleSection>
                )}
            </div>
        </aside>
    );
};

export default SidebarForm;