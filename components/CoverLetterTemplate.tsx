
import React, { FC } from 'react';
import { CVData, CoverLetterData } from '../types';

interface Props {
    cvData: CVData;
    letterData: CoverLetterData;
}

const CoverLetterTemplate: FC<Props> = ({ cvData, letterData }) => {
  const { personalDetails } = cvData;
  const { recipientName, recipientCompany, recipientAddress, letterBody, date } = letterData;

  return (
    <div className="p-12 text-base text-gray-900 bg-white font-serif leading-relaxed">
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
