

import React, { useState, useEffect } from 'react';
import { CVData, CoverLetterData, Template, DocumentType, AnalysisResult, StylingOptions } from './types';
import SidebarForm from './components/SidebarForm';
import Preview from './components/Preview';
import AnalysisModal from './components/AnalysisModal';
import { SaveIcon, FolderOpenIcon } from './components/icons';
import ThemeSwitcher, { themes, Theme } from './components/ThemeSwitcher';

const initialCvData: CVData = {
  personalDetails: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Frontend Developer',
    email: 'jane.doe@example.com',
    phoneNumber: '123-456-7890',
    address: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/janedoe',
    portfolio: 'janedoe.dev',
    photo: '',
  },
  summary: 'Innovative Senior Frontend Developer with 8+ years of experience building and maintaining responsive and user-friendly web applications. Proficient in React, TypeScript, and modern JavaScript frameworks. Passionate about performance, accessibility, and creating seamless user experiences.',
  experience: [
    {
      id: 'exp1',
      jobTitle: 'Senior Frontend Developer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: 'Led the development of a new client-facing dashboard using React and TypeScript, resulting in a 20% increase in user engagement. Mentored junior developers and conducted code reviews to maintain high code quality.'
    },
    {
      id: 'exp2',
      jobTitle: 'Frontend Developer',
      company: 'Web Innovators',
      location: 'Palo Alto, CA',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      description: 'Developed and maintained components for a large-scale e-commerce platform. Collaborated with UI/UX designers to translate wireframes into high-quality code.'
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: 'Aug 2012',
      endDate: 'May 2016'
    }
  ],
  skills: ['React', 'TypeScript', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'Next.js', 'GraphQL', 'Webpack', 'Figma']
};

const initialCoverLetterData: CoverLetterData = {
  recipientName: 'Mr. John Smith',
  recipientCompany: 'Google',
  recipientAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  letterBody: 'Dear Mr. Smith,\n\nI am writing to express my keen interest in the Senior Frontend Developer position at Google, which I discovered on your careers page. With my extensive experience in developing scalable and performant web applications, particularly with React and TypeScript, I am confident that I possess the skills and passion necessary to be a valuable asset to your team.\n\nIn my previous role at Tech Solutions Inc., I led the development of a complex dashboard application that improved user engagement by 20%. This experience, combined with my proficiency in modern frontend technologies and my dedication to writing clean, maintainable code, aligns perfectly with the requirements of this role.\n\nI am incredibly excited about the prospect of contributing to Google\'s innovative projects. Thank you for considering my application. I have attached my CV for your review and look forward to the possibility of discussing my qualifications further in an interview.\n\nSincerely,\nJane Doe'
};

const initialStylingOptions: StylingOptions = {
  fontFamily: 'Inter',
  fontSize: 'Medium',
  lineHeight: 1.5,
  margin: 'Normal',
};

const LOCAL_STORAGE_KEY = 'ai-doc-builder-data';


function App() {
  const [cvData, setCvData] = useState<CVData>(initialCvData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(initialCoverLetterData);
  const [jobDescription, setJobDescription] = useState<string>('Seeking a talented Senior Frontend Developer with expertise in React, TypeScript, and building high-performance UIs. The ideal candidate will have a strong eye for design and a passion for creating exceptional user experiences.');
  const [template, setTemplate] = useState<Template>(Template.MODERN);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.CV);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [theme, setTheme] = useState<Theme>('indigo');
  const [stylingOptions, setStylingOptions] = useState<StylingOptions>(initialStylingOptions);

  useEffect(() => {
    const activeTheme = themes[theme];
    for (const [key, value] of Object.entries(activeTheme)) {
        document.documentElement.style.setProperty(key, value);
    }
  }, [theme]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSaveProgress = () => {
    try {
      const dataToSave = {
        cvData,
        coverLetterData,
        jobDescription,
        template,
        documentType,
        theme,
        stylingOptions,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      setNotification({ message: 'Progress saved successfully!', type: 'success' });
    } catch (error) {
      console.error("Failed to save progress:", error);
      setNotification({ message: 'Failed to save progress.', type: 'error' });
    }
  };

  const handleLoadProgress = () => {
    try {
      const savedDataJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      // FIX: Use `typeof` to ensure the value from localStorage is a string before parsing.
      // This resolves a TypeScript error where JSON.parse could receive an `unknown` type.
      if (typeof savedDataJSON === 'string') {
        const savedData: unknown = JSON.parse(savedDataJSON);
        
        if (savedData && typeof savedData === 'object' && !Array.isArray(savedData)) {
            const data = savedData as Partial<{
              cvData: CVData;
              coverLetterData: CoverLetterData;
              jobDescription: string;
              template: Template;
              documentType: DocumentType;
              theme: Theme;
              stylingOptions: StylingOptions;
            }>;
            setCvData(data.cvData || initialCvData);
            setCoverLetterData(data.coverLetterData || initialCoverLetterData);
            setJobDescription(data.jobDescription || '');
            setTemplate(data.template || Template.MODERN);
            setDocumentType(data.documentType || DocumentType.CV);
            setTheme(data.theme || 'indigo');
            setStylingOptions(data.stylingOptions || initialStylingOptions);
            setNotification({ message: 'Progress loaded successfully!', type: 'success' });
        } else {
            setNotification({ message: 'Could not load saved data. Format is invalid.', type: 'error' });
        }
      } else {
        setNotification({ message: 'No saved data found.', type: 'info' });
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
      setNotification({ message: 'Failed to load progress.', type: 'error' });
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            AI Document <span className="text-[var(--primary)]">Builder</span>
          </h1>
          <div className="flex items-center gap-8">
            <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
            <div className="flex items-center gap-4">
                <button onClick={handleSaveProgress} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[var(--primary)] transition-colors">
                    <SaveIcon />
                    <span>Save Progress</span>
                </button>
                <button onClick={handleLoadProgress} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[var(--primary)] transition-colors">
                    <FolderOpenIcon />
                    <span>Load Progress</span>
                </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 relative">
        {notification && (
           <div className={`fixed top-20 right-8 p-4 rounded-lg shadow-lg text-white z-50 animate-fade-in-out ${
             notification.type === 'success' ? 'bg-green-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
           }`}>
             {notification.message}
           </div>
        )}
        <SidebarForm
          cvData={cvData}
          setCvData={setCvData}
          coverLetterData={coverLetterData}
          setCoverLetterData={setCoverLetterData}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          template={template}
          setTemplate={setTemplate}
          documentType={documentType}
          setDocumentType={setDocumentType}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setAnalysisResult={setAnalysisResult}
          stylingOptions={stylingOptions}
          setStylingOptions={setStylingOptions}
        />
        <Preview
          cvData={cvData}
          coverLetterData={coverLetterData}
          template={template}
          setTemplate={setTemplate}
          documentType={documentType}
          stylingOptions={stylingOptions}
        />
      </main>
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-60 backdrop-blur-sm flex flex-col justify-center items-center z-[999] text-white transition-opacity duration-300 animate-fade-in">
          <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-semibold">AI is generating...</p>
          <p className="text-sm text-slate-300">Please wait a moment.</p>
        </div>
      )}
      {analysisResult && (
        <AnalysisModal result={analysisResult} onClose={() => setAnalysisResult(null)} />
      )}
       <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 3s ease-in-out forwards;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;