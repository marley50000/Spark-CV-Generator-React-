import { GoogleGenAI, Type } from "@google/genai";
import { CVData, CoverLetterData, DocumentType, AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateSummary = async (cvData: CVData, jobDescription: string): Promise<string> => {
  try {
    const prompt = `As an expert CV writer, your task is to create a professional summary.
    Your sole focus is tailoring the summary to the **Target Job Description**.
    First, analyze the job description to identify the most critical requirements.
    Next, review the **Candidate's CV Data**.
    Finally, write a concise, professional summary of 2-3 sentences that highlights the candidate's most relevant skills and experience for the target job.

    **Output instructions:**
    - Your response must be ONLY the summary text.
    - Do not include any introductory phrases like "Here is the summary:" or any other conversational text.
    - The summary should be a direct answer.

    **Target Job Description:**
    ---
    ${jobDescription}
    ---

    **Candidate's CV Data:**
    ---
    Job Title: ${cvData.personalDetails.jobTitle}
    Experience:
    ${cvData.experience.map(exp => `- ${exp.jobTitle} at ${exp.company}: ${exp.description}`).join('\n')}
    Skills: ${cvData.skills.join(', ')}
    ---
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

export const analyzeDocument = async (
    cvData: CVData,
    documentType: DocumentType,
    jobDescription: string,
    coverLetterData?: CoverLetterData
): Promise<AnalysisResult | null> => {
    try {
        const documentContent = documentType === DocumentType.CV ?
            `CV Data: ${JSON.stringify({ summary: cvData.summary, experience: cvData.experience, skills: cvData.skills })}` :
            `Cover Letter Body: ${coverLetterData?.letterBody}`;

        const prompt = `
        You are an expert career coach and AI resume analyzer. Your task is to review the provided document in the context of the given job description and provide a detailed analysis.
        Respond ONLY with a valid JSON object that conforms to the provided schema.

        My Information (for context):
        - Full Name: ${cvData.personalDetails.fullName}
        - Job Title: ${cvData.personalDetails.jobTitle}

        Document to Analyze (${documentType}):
        ---
        ${documentContent}
        ---

        Job Description to Compare Against:
        ---
        ${jobDescription}
        ---

        Analysis Instructions:
        1.  **overallScore**: Rate the document's overall effectiveness for this job application on a scale of 0 to 100.
        2.  **scoreBreakdown**: Provide scores (0-100) for the following three categories:
            - "Relevance": How well does the document content match the job description?
            - "Impact": How effectively are achievements and skills communicated? (e.g., using action verbs, quantifiable results).
            - "Clarity": How clear, concise, and well-structured is the document?
        3.  **strengths**: List 2-3 specific, positive points about the document.
        4.  **suggestions**: Provide 2-3 actionable suggestions for improvement.
        5.  **keywordAnalysis**:
            - "jobKeywords": Extract the 5-7 most critical skills or keywords from the job description.
            - "cvKeywords": Identify which of those "jobKeywords" are present in the document.
            - "missingKeywords": Identify which of those "jobKeywords" are missing from the document.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.INTEGER },
                        scoreBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING },
                                    score: { type: Type.INTEGER }
                                },
                                required: ['category', 'score']
                            }
                        },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keywordAnalysis: {
                            type: Type.OBJECT,
                            properties: {
                                jobKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                                cvKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                                missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ['jobKeywords', 'cvKeywords', 'missingKeywords']
                        }
                    },
                    required: ['overallScore', 'scoreBreakdown', 'strengths', 'suggestions', 'keywordAnalysis']
                }
            }
        });

        return JSON.parse(response.text) as AnalysisResult;

    } catch (error) {
        console.error("Error analyzing document:", error);
        return null;
    }
};