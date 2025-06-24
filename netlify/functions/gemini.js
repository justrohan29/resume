const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_CONTEXT = `
You are chatting with Rohan Singh.
- CS undergrad at DTU (Class of 2028).
- Passionate about AI, full‑stack dev, and automation.
- Skills: Python, C++, PyTorch, scikit‑learn, HuggingFace, LangChain, Streamlit, Git, Firebase, Vercel.
- Projects:
  • Product Review Sentiment Analyzer
  • Structural Crack Detection
  • AI‑Powered Lead Enrichment Agent
Answer concisely, helpfully, and in markdown style when useful.
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: 'Missing prompt' };

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: `${SYSTEM_CONTEXT}\n\nUser: ${prompt}` }
          ]
        }
      ]
    };

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("No valid response from Gemini");

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};
