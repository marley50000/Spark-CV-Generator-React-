
import { GoogleGenAI } from "@google/genai";
import { CVData, CoverLetterData } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (cvData: CVData): Promise<string> => {
  try {
    const prompt = `Based on the following CV data, write a compelling and professional summary of 2-3 sentences. Highlight key skills and experiences.
    
    Job Title: ${cvData.personalDetails.jobTitle}
    Experience: 
    ${cvData.experience.map(exp => `- ${exp.jobTitle} at ${exp.company}: ${exp.description}`).join('\n')}
    Skills: ${cvData.skills.join(', ')}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error: Could not generate summary.";
  }
};

export const generateCoverLetter = async (cvData: CVData, coverLetterData: CoverLetterData, jobDescription: string): Promise<string> => {
    try {
        const prompt = `
        Write a professional and enthusiastic cover letter based on the following information. The tone should be confident and tailored to the job description.

        My Information:
        - Name: ${cvData.personalDetails.fullName}
        - My Target Job Title: ${cvData.personalDetails.jobTitle}
        - My Skills: ${cvData.skills.join(', ')}
        - My Experience Summary:
        ${cvData.experience.map(exp => `  - As a ${exp.jobTitle} at ${exp.company}, I was responsible for ${exp.description}.`).join('\n')}
        - My Professional Summary: ${cvData.summary}

        Recipient Information:
        - Hiring Manager/Contact: ${coverLetterData.recipientName}
        - Company: ${coverLetterData.recipientCompany}

        Job Description I am applying for:
        ---
        ${jobDescription}
        ---

        Instructions:
        1. Address the letter to ${coverLetterData.recipientName}.
        2. Create three paragraphs:
           - First paragraph: State the position being applied for and express strong interest. Briefly mention a key qualification that matches the job description.
           - Second paragraph: Elaborate on my skills and experiences, connecting them directly to the requirements listed in the job description.
           - Third paragraph: Reiterate my enthusiasm for the role and company, and suggest the next steps (e.g., an interview).
        3. Do not include sender/recipient addresses, the date, or the closing (e.g., "Sincerely, [Name]"). Just provide the body of the letter.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating cover letter:", error);
        return "Error: Could not generate cover letter.";
    }
};
