import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the refill data from the request
    const { medication, dosage, patientId, contact, pickupLocation } = JSON.parse(event.body);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert the data into the new 'prescription_refills' table
    const { error } = await supabase
      .from('prescription_refills')
      .insert([{ 
        medication_name: medication, 
        dosage: dosage,
        patient_name: patientId,
        contact_number: contact,
        pickup_location: pickupLocation
      }]);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'Refill request saved successfully' }),
    };
  } catch (error) {
    console.error('Error saving refill request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save refill request' }),
    };
  }
};