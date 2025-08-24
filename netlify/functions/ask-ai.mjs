export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Now we get both the prompt and the language from the request
    const { prompt, language } = JSON.parse(event.body);
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Prompt is required' }) };
    }

    // Define the system instructions for each language
    const systemInstructions = {
      en: "You are a helpful assistant for a healthcare chatbot. Your name is Tony. Keep your answers concise and friendly. Do not provide medical advice. Respond in English.",
      af: "Jy is 'n hulpvaardige assistent vir 'n gesondheidsorg-kletsbot. Jou naam is Tony. Hou jou antwoorde bondig en vriendelik. Moenie mediese advies gee nie. Antwoord in Afrikaans.",
      zu: "Ungumsizi owusizo we-chatbot yezempilo. Igama lakho nguTony. Gcina izimpendulo zakho zifushane futhi zibe nobungane. Unganikezi iseluleko sezokwelapha. Phendula ngesiZulu."
    };

    // Select the correct instruction, defaulting to English
    const instruction = systemInstructions[language] || systemInstructions['en'];

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `System instruction: ${instruction} User question: ${prompt}`
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