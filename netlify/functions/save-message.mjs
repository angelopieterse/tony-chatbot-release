import { createClient } from '@supabase/supabase-js';

// This is the main handler function Netlify will run
export const handler = async (event) => {
  // Only allow POST requests, reject others
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the sender and message from the request body sent by the frontend
    const { sender, message } = JSON.parse(event.body);

    // Get your Supabase credentials securely from Netlify's environment variables
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // Initialize the Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the new message into the 'chat_logs' table
    const { error } = await supabase
      .from('chat_logs')
      .insert([{ sender, message }]);

    // If Supabase returned an error, handle it
    if (error) {
      throw error;
    }

    // Return a success response
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Message saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save message to the database' }),
    };
  }
};