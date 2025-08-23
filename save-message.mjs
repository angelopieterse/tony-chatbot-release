import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Destructure the appointment data from the request
    const { name, reason, dateTime, contact, medicalAid } = JSON.parse(event.body);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the data into the new 'appointments' table
    const { error } = await supabase
      .from('appointments')
      .insert([{ 
        patient_name: name, 
        reason: reason,
        preferred_date_time: dateTime,
        contact_number: contact,
        medical_aid: medicalAid
      }]);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Appointment saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving appointment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save appointment' }),
    };
  }
};