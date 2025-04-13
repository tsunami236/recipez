import axios from "axios";
import { useState } from "react";

const GOOGLE_API_KEY = "AIzaSyALWZmAolwLeB-TZCLex-FdAdffhEHV8ck"; //TYPE YOUR API KEY HERE
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const useFetch = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchGemini = async (prompt: string) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}?key=${GOOGLE_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(
        res.data.candidates[0]?.content?.parts[0]?.text || "No response"
      );
      setLoading(false);
      console.log("API Response:", JSON.stringify(res.data, null, 2));
    } catch (err) {
      setError("Error fetching response");
      setLoading(false);
      console.log(err);
    }
  };

  return { fetchGemini, loading, error, response };
};

export default useFetch;
