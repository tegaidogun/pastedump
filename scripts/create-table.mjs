import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

async function createTable() {
  dotenv.config({ path: '.env.local' });

  const client = await db.connect();

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS pastes (
        id SERIAL PRIMARY KEY,
        short_id VARCHAR(6) UNIQUE,
        content TEXT NOT NULL,
        language VARCHAR(50) NOT NULL,
        author VARCHAR(255),
        expiration TIMESTAMP WITH TIME ZONE NOT NULL,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('Table "pastes" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await client.release();
  }
}

createTable(); 