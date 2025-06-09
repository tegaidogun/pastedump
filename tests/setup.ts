import { supabaseAdmin } from '@/lib/supabaseClient';
import dotenv from 'dotenv';

beforeAll(async () => {
  // Load environment variables from .env.test
  dotenv.config({ path: '.env.test' });

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials must be defined in .env.test');
  }

  try {
    const { error } = await supabaseAdmin.from('pastes').delete().neq('id', -1); // Deletes all rows
    if (error) throw error;
    console.log('Test database "pastes" table cleared.');
  } catch (error) {
    console.error('Error clearing test database:', error);
  }
});

afterAll(async () => {
  // Supabase client doesn't require explicit closing of connections.
}); 