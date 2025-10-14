import React, { FC, useState } from 'react';
import { CVData, CoverLetterData, Template, DocumentType } from '../types';
import CVTemplateModern from './CVTemplateModern';
import CVTemplateClassic from './CVTemplateClassic';
import CoverLetterTemplate from './CoverLetterTemplate';

declare const html2canvas: any;
declare const jspdf: any;

interface PreviewProps {
  cvData: CVData;
  coverLetterData: CoverLetterData;
  template: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template>>;
  documentType: DocumentType;
}

const Preview: FC<PreviewProps> = ({ cvData, coverLetterData, template, setTemplate, documentType }) => {
    
    const [isDownloading, setIsDownloading] = useState(false);

    const renderCV = () => {
        switch (template) {
            case Template.CLASSIC:
                return <CVTemplateClassic data={cvData} />;
            case Template.MODERN:
            default:
                return <CVTemplateModern data={cvData} />;
        }
    };

    const renderCoverLetter = () => {
        return <CoverLetterTemplate cvData={cvData} letterData={coverLetterData} />;
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
                    ? <div key={template} className="cv-transition-container">{renderCV()}</div> 
                    : <div key="cover-letter" className="cv-transition-container">{renderCoverLetter()}</div>
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