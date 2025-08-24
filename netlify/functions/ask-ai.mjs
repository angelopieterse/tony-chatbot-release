export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.GOOGLE_API_KEY; // We'll use a new key name

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    // This is the new URL for the Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System instruction: You are a helpful assistant for a healthcare chatbot. Your name is Tony. Keep your answers concise and friendly. Do not provide medical advice. User question: ${prompt}`
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Google AI API error: ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponse }),
    };

  } catch (error) {
    console.error('Error calling Google AI API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get a response from the AI' }),
    };
  }
};