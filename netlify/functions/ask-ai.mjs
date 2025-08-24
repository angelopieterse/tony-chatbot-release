export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // A powerful and cost-effective model
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for a healthcare chatbot. Your name is Tony. Keep your answers concise and friendly. Do not provide medical advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100, // Limit the length of the response
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: aiResponse }),
    };

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get a response from the AI' }),
    };
  }
};