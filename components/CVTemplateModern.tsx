
import React, { FC } from 'react';
import { CVData, StylingOptions } from '../types';
import { MailIcon, PhoneIcon, MapPinIcon, LinkIcon, UserIcon, BriefcaseIcon, GraduationCapIcon, LightbulbIcon } from './icons';

interface Props {
  data: CVData;
  options: StylingOptions;
}

const CVTemplateModern: FC<Props> = ({ data, options }) => {
  const { personalDetails, summary, experience, education, skills } = data;

  const fontFamilies: Record<StylingOptions['fontFamily'], string> = { 'Inter': 'font-sans', 'Georgia': 'font-serif', 'Roboto Mono': 'font-mono' };
  const fontSizes: Record<StylingOptions['fontSize'], string> = { 'Small': 'text-sm', 'Medium': 'text-base', 'Large': 'text-lg' };
  const margins: Record<StylingOptions['margin'], string> = { 'Narrow': 'p-6', 'Normal': 'p-8', 'Wide': 'p-10' };

  const containerClasses = `${margins[options.margin]} ${fontSizes[options.fontSize]} text-gray-800 bg-white flex ${fontFamilies[options.fontFamily]}`;

  return (
    <div className={containerClasses} style={{ lineHeight: options.lineHeight }}>
      {/* Left Column */}
      <div className="w-1/3 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-[var(--primary-text-dark)]">{personalDetails.fullName}</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-6">{personalDetails.jobTitle}</h2>

        <Section title="Contact" icon={<UserIcon />}>
          <ContactItem icon={<MailIcon />} text={personalDetails.email} href={`mailto:${personalDetails.email}`} />
          <ContactItem icon={<PhoneIcon />} text={personalDetails.phoneNumber} href={`tel:${personalDetails.phoneNumber}`} />
          <ContactItem icon={<MapPinIcon />} text={personalDetails.address} />
          <ContactItem icon={<LinkIcon />} text={personalDetails.linkedIn} href={`https://${personalDetails.linkedIn}`} />
          <ContactItem icon={<LinkIcon />} text={personalDetails.portfolio} href={`https://${personalDetails.portfolio}`} />
        </Section>
        
        <Section title="Skills" icon={<LightbulbIcon />}>
          <ul className="space-y-1">
            {skills.map((skill, index) => (
              <li key={index} className="text-gray-700">{skill}</li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Right Column */}
      <div className="w-2/3 pl-8">
        <Section title="Summary" icon={<LightbulbIcon />}>
          <p className="text-gray-700">{summary}</p>
        </Section>

        <Section title="Experience" icon={<BriefcaseIcon />}>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-[var(--primary)]">{exp.company}, {exp.location}</p>
                <p className="text-gray-500">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-gray-700 mt-1">{exp.description}</p>
            </div>
          ))}
        </Section>

        <Section title="Education" icon={<GraduationCapIcon />}>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <div className="flex justify-between items-baseline">
                 <p className="font-semibold text-[var(--primary)]">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-gray-500">{edu.startDate} - {edu.endDate}</p>
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
};

const Section: FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-bold text-gray-800 border-b-2 border-[var(--primary-border)] pb-1 mb-3 flex items-center gap-2">
        <span className="text-[var(--primary)]">{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const ContactItem: FC<{ icon: React.ReactNode, text: string, href?: string }> = ({ icon, text, href }) => (
    <div className="flex items-center gap-2 mb-2">
        <span className="text-[var(--primary)] w-4 h-4">{icon}</span>
        {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[var(--primary)]">{text}</a> : <span className="text-gray-700">{text}</span>}
    </div>
);


export default CVTemplateModern;