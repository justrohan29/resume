const fetch = require('node-fetch');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const SYSTEM_CONTEXT = `
You are an AI assistant helping answer questions about Rohan Singh.
- He's a CS undergrad at DTU (Class of 2028).
- Passionate about AI, full-stack development, and automation.
- Skilled in Python, C++, PyTorch, scikit-learn, HuggingFace, LangChain, Streamlit, Git, Firebase, and Vercel.
- Projects:
  1. Product Review Sentiment Analyzer
  2. Structural Crack Detection
  3. AI-Powered Lead Enrichment Agent
Respond concisely in markdown when helpful.
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body || '{}');
  if (!prompt) {
    return { statusCode: 400, body: 'Missing prompt' };
  }

  try {
    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${SYSTEM_CONTEXT}\n\nUser: ${prompt}` }]
        }
      ]
    };

    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Gemini response:', JSON.stringify(data, null, 2));
      return { statusCode: 200, body: JSON.stringify({ reply: '⚠️ No response from Gemini API.' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error('Gemini fetch error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
};
