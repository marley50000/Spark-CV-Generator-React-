
import React, { FC, useState } from 'react';
import { CVData, CoverLetterData, Template, DocumentType } from '../types';
import { generateSummary, generateCoverLetter } from '../services/geminiService';
import { BriefcaseIcon, GraduationCapIcon, LightbulbIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon, LinkIcon, SparklesIcon, ChevronDownIcon } from './icons';

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
}

const SidebarForm: FC<SidebarFormProps> = ({
  cvData, setCvData, coverLetterData, setCoverLetterData, jobDescription, setJobDescription, template, setTemplate, documentType, setDocumentType, isLoading, setIsLoading
}) => {
  
    const handleGenerateSummary = async () => {
        setIsLoading(true);
        const summary = await generateSummary(cvData);
        setCvData(prev => ({ ...prev, summary }));
        setIsLoading(false);
    };

    const handleGenerateCoverLetter = async () => {
        setIsLoading(true);
        const letterBody = await generateCoverLetter(cvData, coverLetterData, jobDescription);
        setCoverLetterData(prev => ({ ...prev, letterBody }));
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
            experience: [...prev.experience, { id: crypto.randomUUID(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' }]
        }));
    };

    const removeExperience = (id: string) => {
        setCvData(prev => ({
            ...prev,
            experience: prev.experience.filter(exp => exp.id !== id)
        }));
    };
    
    // Similar functions for Education
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
            education: [...prev.education, { id: crypto.randomUUID(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' }]
        }));
    };
    
    const removeEducation = (id: string) => {
        setCvData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const skills = e.target.value.split(',').map(skill => skill.trim());
      setCvData(prev => ({...prev, skills}));
    }

    const renderCVForm = () => (
        <div className="space-y-6">
            <CollapsibleSection title="Personal Details" icon={<UserIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" name="fullName" value={cvData.personalDetails.fullName} onChange={handlePersonalDetailsChange} icon={<UserIcon />} />
                  <Input label="Job Title" name="jobTitle" value={cvData.personalDetails.jobTitle} onChange={handlePersonalDetailsChange} icon={<BriefcaseIcon />} />
                  <Input label="Email" name="email" type="email" value={cvData.personalDetails.email} onChange={handlePersonalDetailsChange} icon={<MailIcon />} />
                  <Input label="Phone Number" name="phoneNumber" type="tel" value={cvData.personalDetails.phoneNumber} onChange={handlePersonalDetailsChange} icon={<PhoneIcon />} />
                  <Input label="Address" name="address" value={cvData.personalDetails.address} onChange={handlePersonalDetailsChange} icon={<MapPinIcon />} className="md:col-span-2"/>
                  <Input label="LinkedIn" name="linkedIn" value={cvData.personalDetails.linkedIn} onChange={handlePersonalDetailsChange} icon={<LinkIcon />} />
                  <Input label="Portfolio/Website" name="portfolio" value={cvData.personalDetails.portfolio} onChange={handlePersonalDetailsChange} icon={<LinkIcon />} />
              </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Professional Summary" icon={<LightbulbIcon />}>
                <textarea name="summary" value={cvData.summary} onChange={handleCvDataChange} rows={5} className="w-full p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Write a brief summary..."></textarea>
                <AIGenerateButton onClick={handleGenerateSummary} isLoading={isLoading} text="Generate Summary"/>
            </CollapsibleSection>
            
            <CollapsibleSection title="Work Experience" icon={<BriefcaseIcon />}>
                {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 border rounded-lg mb-4 bg-slate-50 relative">
                        <h4 className="font-semibold mb-2 text-slate-700">Experience #{index + 1}</h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Job Title" name="jobTitle" value={exp.jobTitle} onChange={e => handleExperienceChange(exp.id, e)} />
                            <Input label="Company" name="company" value={exp.company} onChange={e => handleExperienceChange(exp.id, e)} />
                            <Input label="Location" name="location" value={exp.location} onChange={e => handleExperienceChange(exp.id, e)} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input label="Start Date" name="startDate" value={exp.startDate} onChange={e => handleExperienceChange(exp.id, e)} />
                                <Input label="End Date" name="endDate" value={exp.endDate} onChange={e => handleExperienceChange(exp.id, e)} />
                            </div>
                            <textarea name="description" value={exp.description} onChange={e => handleExperienceChange(exp.id, e)} rows={4} className="md:col-span-2 w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe your responsibilities and achievements..."></textarea>
                        </div>
                        <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                    </div>
                ))}
                <button onClick={addExperience} className="w-full text-indigo-600 border border-indigo-600 rounded-md py-2 hover:bg-indigo-50 transition-colors">Add Experience</button>
            </CollapsibleSection>

            <CollapsibleSection title="Education" icon={<GraduationCapIcon />}>
              {cvData.education.map((edu, index) => (
                  <div key={edu.id} className="p-4 border rounded-lg mb-4 bg-slate-50 relative">
                      <h4 className="font-semibold mb-2 text-slate-700">Education #{index + 1}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Institution" name="institution" value={edu.institution} onChange={e => handleEducationChange(edu.id, e)} className="md:col-span-2" />
                        <Input label="Degree" name="degree" value={edu.degree} onChange={e => handleEducationChange(edu.id, e)} />
                        <Input label="Field of Study" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={e => handleEducationChange(edu.id, e)} />
                        <Input label="Start Date" name="startDate" value={edu.startDate} onChange={e => handleEducationChange(edu.id, e)} />
                        <Input label="End Date" name="endDate" value={edu.endDate} onChange={e => handleEducationChange(edu.id, e)} />
                      </div>
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                  </div>
              ))}
               <button onClick={addEducation} className="w-full text-indigo-600 border border-indigo-600 rounded-md py-2 hover:bg-indigo-50 transition-colors">Add Education</button>
            </CollapsibleSection>
            
            <CollapsibleSection title="Skills" icon={<LightbulbIcon />}>
                <Input label="Skills (comma separated)" name="skills" value={cvData.skills.join(', ')} onChange={handleSkillsChange} placeholder="React, TypeScript, Figma..." />
            </CollapsibleSection>
        </div>
    );

    const renderCoverLetterForm = () => (
        <div className="space-y-6">
            <CollapsibleSection title="Recipient Details" icon={<UserIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Recipient Name" name="recipientName" value={coverLetterData.recipientName} onChange={handleCoverLetterDataChange} />
                    <Input label="Company Name" name="recipientCompany" value={coverLetterData.recipientCompany} onChange={handleCoverLetterDataChange} />
                    <Input label="Company Address" name="recipientAddress" value={coverLetterData.recipientAddress} onChange={handleCoverLetterDataChange} className="md:col-span-2"/>
                    <Input label="Date" name="date" value={coverLetterData.date} onChange={handleCoverLetterDataChange} className="md:col-span-2"/>
                </div>
            </CollapsibleSection>
            
            <CollapsibleSection title="Job Description" icon={<BriefcaseIcon />}>
                <p className="text-sm text-slate-600 mb-2">Provide the job description for a more tailored cover letter.</p>
                <textarea name="jobDescription" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={6} className="w-full p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Paste the job description here..."></textarea>
            </CollapsibleSection>

            <CollapsibleSection title="Letter Body" icon={<MailIcon />}>
                <textarea name="letterBody" value={coverLetterData.letterBody} onChange={handleCoverLetterDataChange} rows={15} className="w-full p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Write your cover letter..."></textarea>
                <AIGenerateButton onClick={handleGenerateCoverLetter} isLoading={isLoading} text="Generate Cover Letter"/>
            </CollapsibleSection>
        </div>
    );

  return (
    <aside className="w-full bg-white p-6 overflow-y-auto h-screen max-h-screen">
      <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
            <select value={template} onChange={e => setTemplate(e.target.value as Template)} className="w-full p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                {Object.values(Template).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        
        <div>
            <div className="flex border-b">
                <TabButton title="CV" active={documentType === DocumentType.CV} onClick={() => setDocumentType(DocumentType.CV)} />
                <TabButton title="Cover Letter" active={documentType === DocumentType.COVER_LETTER} onClick={() => setDocumentType(DocumentType.COVER_LETTER)} />
            </div>
        </div>
        
        <div className="mt-6">
            {documentType === DocumentType.CV ? renderCVForm() : renderCoverLetterForm()}
        </div>
      </div>
    </aside>
  );
};

// Helper components defined outside to prevent re-renders
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

const Input: FC<InputProps> = ({ label, name, icon, ...props }) => (
    <div className={props.className}>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <div className="relative">
            {icon && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">{icon}</span>}
            <input id={name} name={name} {...props} className={`w-full p-2 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${icon ? 'pl-10' : ''}`} />
        </div>
    </div>
);

const TabButton: FC<{ title: string; active: boolean; onClick: () => void; }> = ({ title, active, onClick }) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium transition-colors ${active ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
        {title}
    </button>
);

const AIGenerateButton: FC<{ onClick: () => void; isLoading: boolean; text: string }> = ({ onClick, isLoading, text }) => (
    <button onClick={onClick} disabled={isLoading} className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
        {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
            <SparklesIcon />
        )}
        {isLoading ? 'Generating...' : text}
    </button>
);

const CollapsibleSection: FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border rounded-lg">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 bg-slate-50 rounded-t-lg hover:bg-slate-100">
                <div className="flex items-center gap-3">
                    <span className="text-indigo-600">{icon}</span>
                    <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
                </div>
                <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
            </button>
            {isOpen && <div className="p-4">{children}</div>}
        </div>
    );
};

export default SidebarForm;
