import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function resetDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env.local. Please ensure it is set correctly.');
    process.exit(1);
  }

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Successfully connected to the database.');

    // Drop all user-created tables in the public schema
    console.log('Dropping user-created tables...');
    // We only have one table, `pastes`, and node-pg-migrate creates `pgmigrations`.
    await client.query('DROP TABLE IF EXISTS public.pastes, public.pgmigrations CASCADE;');
    console.log('Tables dropped successfully.');
    
    // Note: If you add more tables, they must be added to the DROP TABLE command above.
    // A more advanced script could dynamically find all tables and drop them.
    // For this project, explicitly dropping the known tables is safer and clearer.

  } catch (error) {
    console.error('An error occurred during database reset:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

resetDatabase(); 