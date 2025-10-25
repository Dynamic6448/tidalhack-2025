/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai';

// Ensure the API key is loaded
if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.');
}

const genAI = new GoogleGenAI({});

// 1. CORRECTED MODEL NAME
// 'gemini-1.5-flash-latest' is fast and capable, which is perfect for a hackathon.
export async function analyzeFlightData(flightData: any) {
    // 2. IMPROVED PROMPT FOR STRUCTURED JSON OUTPUT
    const prompt = `
  You are an expert aerospace diagnostics AI. Your task is to analyze flight data and return a JSON object with your findings.

  Analyze the following flight data:
  ${JSON.stringify(flightData, null, 2)}

  

  Based on the data, provide the following in a JSON format:
  1. "component": Give the name of the component that is detected to potentially be faulty (e.g., "Engine 1", "Hydraulic System").
  2. "severity": A single keyword describing the severity of this problem: "normal", "caution", or "critical".
  3. "description": A concise one-sentence description of the specific issue.
  4. "recommendation": A concise one-sentence recommendation for actions or components to inspect.
  5. "score": A numerical score from 0 to 100 indicating the health of the aircraft overall (100 = perfect health, 0 = the entire aircraft doesn't work).

  Example:
  Component: "Engine 1"
  Severity: "Caution"
  Description: "Exhaust Gas Temperature trending 15% above normal operating range."
  Recommendation: "Schedule combustion chamber inspection within next 100 flight hours."
  Score: 85

  Return ONLY the raw JSON object. Do not include markdown formatting like \`\`\`json.
 `;

    const response = await genAI.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: prompt,
    });
    const text = response.text;

    if (!text) {
        console.error('No text returned from Gemini model.');
        // Fallback in case the model doesn't return perfect JSON
        return {
            summary: 'AI response could not be parsed. See raw text for details.',
            status: 'Error',
            rawText: text, // Include the raw text for debugging
            anomalies: [],
            recommendations: [],
        };
    }

    try {
        // The model should return a JSON string, so we parse it.
        return JSON.parse(text);
    } catch {
        console.error('Failed to parse Gemini response as JSON:', text);
        // Fallback in case the model doesn't return perfect JSON
        return {
            summary: 'AI response could not be parsed. See raw text for details.',
            status: 'Error',
            rawText: text, // Include the raw text for debugging
            anomalies: [],
            recommendations: [],
        };
    }
}
