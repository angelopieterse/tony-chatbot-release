import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  // --- Start of Logging ---
  console.log("Function invoked!"); 
  // --- End of Logging ---

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const appointmentData = JSON.parse(event.body);

    // --- Start of Logging ---
    console.log("Received data:", JSON.stringify(appointmentData, null, 2));
    // --- End of Logging ---

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('appointments')
      .insert([{ 
        patient_name: appointmentData.name, 
        reason: appointmentData.reason,
        preferred_date_time: appointmentData.dateTime,
        contact_number: appointmentData.contact,
        medical_aid: appointmentData.medicalAid
      }]);

    if (error) {
      // --- Start of Logging ---
      console.error("Supabase error:", error.message);
      // --- End of Logging ---
      throw error;
    }

    // --- Start of Logging ---
    console.log("Successfully inserted data:", data);
    // --- End of Logging ---

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Appointment saved successfully' }),
    };
  } catch (error) {
    console.error('Function execution error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save appointment' }),
    };
  }
};