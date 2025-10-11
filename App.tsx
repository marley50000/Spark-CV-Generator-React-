
import React, { useState } from 'react';
import { CVData, CoverLetterData, Template, DocumentType } from './types';
import SidebarForm from './components/SidebarForm';
import Preview from './components/Preview';

const initialCvData: CVData = {
  personalDetails: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Frontend Developer',
    email: 'jane.doe@example.com',
    phoneNumber: '123-456-7890',
    address: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/janedoe',
    portfolio: 'janedoe.dev'
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


function App() {
  const [cvData, setCvData] = useState<CVData>(initialCvData);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(initialCoverLetterData);
  const [jobDescription, setJobDescription] = useState<string>('Seeking a talented Senior Frontend Developer with expertise in React, TypeScript, and building high-performance UIs. The ideal candidate will have a strong eye for design and a passion for creating exceptional user experiences.');
  const [template, setTemplate] = useState<Template>(Template.MODERN);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.CV);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            AI Document <span className="text-indigo-600">Builder</span>
          </h1>
        </div>
      </header>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2">
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
        />
        <Preview
          cvData={cvData}
          coverLetterData={coverLetterData}
          template={template}
          documentType={documentType}
        />
      </main>
    </div>
  );
}

export default App;
