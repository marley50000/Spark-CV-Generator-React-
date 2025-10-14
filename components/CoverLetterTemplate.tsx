
import React, { FC } from 'react';
import { CVData, CoverLetterData, StylingOptions } from '../types';

interface Props {
    cvData: CVData;
    letterData: CoverLetterData;
    options: StylingOptions;
}

const CoverLetterTemplate: FC<Props> = ({ cvData, letterData, options }) => {
  const { personalDetails } = cvData;
  const { recipientName, recipientCompany, recipientAddress, letterBody, date } = letterData;

  const fontFamilies: Record<StylingOptions['fontFamily'], string> = { 'Inter': 'font-sans', 'Georgia': 'font-serif', 'Roboto Mono': 'font-mono' };
  const fontSizes: Record<StylingOptions['fontSize'], string> = { 'Small': 'text-sm', 'Medium': 'text-base', 'Large': 'text-lg' };
  const margins: Record<StylingOptions['margin'], string> = { 'Narrow': 'p-10', 'Normal': 'p-12', 'Wide': 'p-14' };

  const containerClasses = `${margins[options.margin]} ${fontSizes[options.fontSize]} text-gray-900 bg-white ${fontFamilies[options.fontFamily]}`;


  return (
    <div className={containerClasses} style={{ lineHeight: options.lineHeight }}>
        <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
                <h2 className="text-2xl font-bold">{personalDetails.fullName}</h2>
                <p>{personalDetails.jobTitle}</p>
                <p>{personalDetails.address}</p>
                <p>{personalDetails.email}</p>
                <p>{personalDetails.phoneNumber}</p>
            </div>
            <div className="text-right">
                <p>{date}</p>
            </div>
        </div>

        <div className="mb-8">
            <p className="font-bold">{recipientName}</p>
            <p>{recipientCompany}</p>
            <p>{recipientAddress}</p>
        </div>

        <div className="space-y-4 whitespace-pre-wrap">
            {letterBody}
        </div>
    </div>
  );
};

export default CoverLetterTemplate;