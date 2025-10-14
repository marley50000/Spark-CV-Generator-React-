
import React, { FC } from 'react';
import { CVData, StylingOptions } from '../types';

interface Props {
  data: CVData;
  options: StylingOptions;
}

const CVTemplateClassic: FC<Props> = ({ data, options }) => {
  const { personalDetails, summary, experience, education, skills } = data;
  
  const fontFamilies: Record<StylingOptions['fontFamily'], string> = { 'Inter': 'font-sans', 'Georgia': 'font-serif', 'Roboto Mono': 'font-mono' };
  const fontSizes: Record<StylingOptions['fontSize'], string> = { 'Small': 'text-sm', 'Medium': 'text-base', 'Large': 'text-lg' };
  const margins: Record<StylingOptions['margin'], string> = { 'Narrow': 'p-8', 'Normal': 'p-10', 'Wide': 'p-12' };

  const containerClasses = `${margins[options.margin]} ${fontSizes[options.fontSize]} text-gray-900 bg-white ${fontFamilies[options.fontFamily]}`;

  return (
    <div className={containerClasses} style={{ lineHeight: options.lineHeight }}>
      <header className="text-center mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold tracking-wider">{personalDetails.fullName}</h1>
        <h2 className="text-xl font-medium text-gray-600 mt-1">{personalDetails.jobTitle}</h2>
        <div className="flex justify-center gap-x-6 gap-y-2 mt-4 text-sm flex-wrap">
          <span>{personalDetails.address}</span>
          <span>&bull;</span>
          <a href={`tel:${personalDetails.phoneNumber}`} className="text-[var(--primary)] hover:text-[var(--primary-hover)]">{personalDetails.phoneNumber}</a>
          <span>&bull;</span>
          <a href={`mailto:${personalDetails.email}`} className="text-[var(--primary)] hover:text-[var(--primary-hover)]">{personalDetails.email}</a>
          <span>&bull;</span>
          <a href={`https://${personalDetails.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:text-[var(--primary-hover)]">{personalDetails.linkedIn}</a>
          <span>&bull;</span>
          <a href={`https://${personalDetails.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:text-[var(--primary-hover)]">{personalDetails.portfolio}</a>
        </div>
      </header>
      
      <main>
        <Section title="Professional Summary">
          <p>{summary}</p>
        </Section>
        
        <Section title="Skills">
          <p>{skills.join(' | ')}</p>
        </Section>
        
        <Section title="Work Experience">
          {experience.map(exp => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                  <p className="text-md font-semibold text-gray-700">{exp.company}, {exp.location}</p>
                </div>
                <p className="text-sm text-gray-600 min-w-max ml-4">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="mt-1 text-sm">{exp.description}</p>
            </div>
          ))}
        </Section>
        
        <Section title="Education">
          {education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{edu.institution}</h3>
                  <p className="text-md font-semibold text-gray-700">{edu.degree}, {edu.fieldOfStudy}</p>
                </div>
                <p className="text-sm text-gray-600 min-w-max ml-4">{edu.startDate} - {edu.endDate}</p>
              </div>
            </div>
          ))}
        </Section>
      </main>
    </div>
  );
};

const Section: FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <section className="mb-6">
    <h3 className="text-xl font-bold border-b-2 border-gray-300 pb-1 mb-3 uppercase tracking-widest">{title}</h3>
    {children}
  </section>
);

export default CVTemplateClassic;