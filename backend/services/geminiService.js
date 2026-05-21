const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = 'gemini-2.5-flash';

async function analyzeResume(resumeText) {
  const prompt = `
    You are an expert HR Technical Recruiter. Analyze the following resume text.
    Extract the candidate's key skills, top projects, and experience level.
    Provide a JSON response with the following structure:
    {
      "skills": ["skill1", "skill2"],
      "experienceLevel": "Entry/Mid/Senior",
      "summary": "A brief summary of the candidate's profile",
      "suggestedRole": "The most appropriate job role based on the resume",
      "suggestedQuestions": ["Question 1", "Question 2", "Question 3"]
    }
    Resume Text:
    ${resumeText}
    
    Return ONLY valid JSON. No markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Analyze Resume):", error);
    throw error;
  }
}

async function generateQuestion(history, resumeContext, role) {
  const prompt = `
    You are an AI Interviewer conducting an interview for a ${role} role.
    Here is the candidate's background context and targeted focus areas/skills: ${JSON.stringify(resumeContext)}
    
    Here is the interview history so far:
    ${JSON.stringify(history)}
    
    Based on the history and the candidate's targeted skills, generate the next interview question.
    Make it conversational, natural, and highly relevant.
    CRITICAL INSTRUCTION: Always align your questions with the specific skills/focus areas the user requested. 
    If it's the beginning, start by asking a direct question about one of their specified target skills.
    For subsequent questions, heavily prioritize asking deep follow-up questions based on their previous answers to probe their knowledge on those specific skills.
    
    Return ONLY the text of the next question.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error (Generate Question):", error);
    throw error;
  }
}

async function evaluateAnswer(question, answer) {
  const prompt = `
    You are an expert interviewer.
    Question asked: "${question}"
    Candidate's answer: "${answer}"
    
    Evaluate the candidate's answer based on clarity, technical accuracy (if applicable), and confidence.
    Provide a JSON response with the following structure:
    {
      "score": <number between 1-10>,
      "feedback": "<constructive feedback on the answer>",
      "strengths": ["strength1"],
      "improvements": ["improvement1"]
    }
    
    Return ONLY valid JSON. No markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Evaluate Answer):", error);
    throw error;
  }
}

async function evaluateInterview(history) {
  const prompt = `
    You are an expert HR and Technical Recruiter.
    Review the following interview transcript:
    ${JSON.stringify(history)}
    
    Evaluate the candidate's performance across the entire interview.
    Provide a JSON response with exactly this structure:
    {
      "overallScore": <number between 1-100>,
      "technicalAccuracy": <number between 1-100>,
      "communicationScore": <number between 1-100>,
      "confidenceScore": <number between 1-100>,
      "strengths": ["strength1", "strength2", "strength3"],
      "improvements": ["improvement1", "improvement2", "improvement3"],
      "timelineData": [
        {"name": "Q1", "score": <number>},
        {"name": "Q2", "score": <number>}
        // Add as many as there are user answers in the history
      ]
    }
    
    Return ONLY valid JSON. No markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    let text = response.text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error (Evaluate Interview):", error);
    throw error;
  }
}

module.exports = {
  analyzeResume,
  generateQuestion,
  evaluateAnswer,
  evaluateInterview
};
