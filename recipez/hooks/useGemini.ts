
const GOOGLE_API_KEY = "AIzaSyALWZmAolwLeB-TZCLex-FdAdffhEHV8ck"
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"


export const fetchGeminiResponse = async (prompt: string): Promise<string[]> => {
    const response = await fetch(`${BASE_URL}?key=${GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
  
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No recipes found.";
  
    return text.split("\n\n");
  };
  