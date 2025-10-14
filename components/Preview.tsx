

import React, { FC, useState } from 'react';
import { CVData, CoverLetterData, Template, DocumentType, StylingOptions } from '../types';
import CVTemplateModern from './CVTemplateModern';
import CVTemplateClassic from './CVTemplateClassic';
import CoverLetterTemplate from './CoverLetterTemplate';
import { MailIcon, PhoneIcon, MapPinIcon, LinkIcon } from './icons';

declare const html2canvas: any;
declare const jspdf: any;

interface PreviewProps {
  cvData: CVData;
  coverLetterData: CoverLetterData;
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  documentType: DocumentType;
  stylingOptions: StylingOptions;
}

// --- START OF NEW ELEGANT TEMPLATE COMPONENT ---
const ElegantContactItem: FC<{ icon: React.ReactNode, text: string, href?: string }> = ({ icon, text, href }) => (
    <div className="flex items-start gap-3 mb-2 text-sm">
        <span className="text-slate-500 w-4 h-4 mt-0.5">{icon}</span>
        {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary)] break-all">{text}</a> : <span className="text-gray-700 break-all">{text}</span>}
    </div>
);

const ElegantSection: FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pb-1 mb-3 border-b border-slate-300">
        {title}
    </h3>
    {children}
  </div>
);

const CVTemplateElegant: FC<{ data: CVData; options: StylingOptions; }> = ({ data, options }) => {
  const { personalDetails, summary, experience, education, skills } = data;

  const fontFamilies: Record<StylingOptions['fontFamily'], string> = { 'Inter': 'font-sans', 'Georgia': 'font-serif', 'Roboto Mono': 'font-mono' };
  const fontSizes: Record<StylingOptions['fontSize'], string> = { 'Small': 'text-sm', 'Medium': 'text-base', 'Large': 'text-lg' };
  const margins: Record<StylingOptions['margin'], string> = { 'Narrow': 'p-6', 'Normal': 'p-8', 'Wide': 'p-10' };

  const containerClasses = `${margins[options.margin]} ${fontSizes[options.fontSize]} text-gray-800 bg-white flex ${fontFamilies[options.fontFamily]}`;

  return (
    <div className={containerClasses} style={{ lineHeight: options.lineHeight }}>
      {/* Left Column */}
      <div className="w-1/3 bg-slate-50 p-6 border-r-2 border-slate-200">
        {personalDetails.photo && (
            <div className="mb-6">
                <img src={personalDetails.photo} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md" />
            </div>
        )}
        <h1 className="text-3xl font-bold text-slate-800 text-center">{personalDetails.fullName}</h1>
        <h2 className="text-lg font-semibold text-[var(--primary)] text-center mb-6">{personalDetails.jobTitle}</h2>

        <ElegantSection title="Contact">
          <ElegantContactItem icon={<MailIcon />} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
          <ElegantContactItem icon={<PhoneIcon />} text={personalDetails.phoneNumber} href={`tel:${personalDetails.phoneNumber}`} />
          <ElegantContactItem icon={<MapPinIcon />} text={personalDetails.address} />
          <ElegantContactItem icon={<LinkIcon />} text={personalDetails.linkedIn} href={`https://${personalDetails.linkedIn}`} />
          <ElegantContactItem icon={<LinkIcon />} text={personalDetails.portfolio} href={`https://${personalDetails.portfolio}`} />
        </ElegantSection>
        
        <ElegantSection title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <li key={index} className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                {skill}
              </li>
            ))}
          </ul>
        </ElegantSection>
      </div>

      {/* Right Column */}
      <div className="w-2/3 pl-8 pt-6">
        <ElegantSection title="Summary">
          <p className="text-gray-700 italic">{summary}</p>
        </ElegantSection>

        <ElegantSection title="Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 relative pl-4">
              <div className="absolute left-0 h-full w-0.5 bg-slate-200"></div>
              <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 bg-[var(--primary)] rounded-full border-2 border-white"></div>
              <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-slate-600">{exp.company}, {exp.location}</p>
                <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{exp.description}</p>
            </div>
          ))}
        </ElegantSection>

        <ElegantSection title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-2 relative pl-4">
               <div className="absolute left-0 h-full w-0.5 bg-slate-200"></div>
               <div className="absolute left-[-4.5px] top-1 w-2.5 h-2.5 bg-[var(--primary)] rounded-full border-2 border-white"></div>
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <div className="flex justify-between items-baseline">
                 <p className="font-semibold text-slate-600">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            </div>
          ))}
        </ElegantSection>
      </div>
    </div>
  );
};
// --- END OF NEW ELEGANT TEMPLATE COMPONENT ---

const Preview: FC<PreviewProps> = ({ cvData, coverLetterData, template, setTemplate, documentType, stylingOptions }) => {
    
    const [isDownloading, setIsDownloading] = useState(false);

    const renderCV = () => {
        switch (template) {
            case Template.CLASSIC:
                return <CVTemplateClassic data={cvData} options={stylingOptions} />;
            case Template.ELEGANT:
                return <CVTemplateElegant data={cvData} options={stylingOptions} />;
            case Template.MODERN:
            default:
                return <CVTemplateModern data={cvData} options={stylingOptions} />;
        }
    };

    const renderCoverLetter = () => {
        return <CoverLetterTemplate cvData={cvData} letterData={coverLetterData} options={stylingOptions} />;
    };

    const handleDownloadPdf = async () => {
        const input = document.getElementById('document-preview');
        if (!input) return;

        setIsDownloading(true);

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps= pdf.getImageProperties(imgData);
            const imgWidth = imgProps.width;
            const imgHeight = imgProps.height;
            
            const ratio = pdfWidth / imgWidth;
            const scaledHeight = imgHeight * ratio;

            let heightLeft = scaledHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledHeight);
                heightLeft -= pdfHeight;
            }

            const fileName = documentType === DocumentType.CV 
                ? `${cvData.personalDetails.fullName.replace(/\s+/g, '_')}_CV.pdf` 
                : `${cvData.personalDetails.fullName.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const TemplateToggleButton: FC<{value: Template, children: React.ReactNode}> = ({ value, children }) => {
        const isActive = template === value;
        return (
            <button
                onClick={() => setTemplate(value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-ring)] ${
                    isActive
                        ? 'bg-[var(--primary)] text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'
                }`}
            >
                {children}
            </button>
        )
    }

    return (
        <section className="w-full bg-slate-200 p-8 overflow-y-auto h-screen max-h-screen relative">
            <div className="flex justify-between items-center mb-4 print:hidden">
                <div>
                    {documentType === DocumentType.CV && (
                        <div className="flex items-center p-1 bg-slate-200 rounded-lg space-x-1">
                           <TemplateToggleButton value={Template.MODERN}>Modern</TemplateToggleButton>
                           <TemplateToggleButton value={Template.CLASSIC}>Classic</TemplateToggleButton>
                           <TemplateToggleButton value={Template.ELEGANT}>Elegant</TemplateToggleButton>
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="bg-[var(--primary)] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[var(--primary-hover)] transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isDownloading ? (
                         <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Downloading...</span>
                        </>
                    ) : (
                       'Download PDF'
                    )}
                </button>
            </div>
            <div id="document-preview" className="bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
                {documentType === DocumentType.CV 
                    ? <div key={`${template}-${JSON.stringify(stylingOptions)}`} className="cv-transition-container">{renderCV()}</div> 
                    : <div key={`cover-letter-${JSON.stringify(stylingOptions)}`} className="cv-transition-container">{renderCoverLetter()}</div>
                }
            </div>
            <style>
            {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #document-preview, #document-preview * {
                        visibility: visible;
                    }
                    #document-preview {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        border: none;
                        box-shadow: none;
                    }
                }

                .cv-transition-container {
                    animation: fadeIn 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}
            </style>
        </section>
    );
};

export default Preview;
