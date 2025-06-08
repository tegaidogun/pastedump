import { db } from '@vercel/postgres';
import dotenv from 'dotenv';

beforeAll(async () => {
  // Load environment variables from .env.test
  dotenv.config({ path: '.env.test' });

  const client = await db.connect();
  
  try {
    // Clear the pastes table before running tests
    await client.sql`
      DELETE FROM pastes;
    `;
    console.log('Test database cleared.');
  } catch (error) {
    console.error('Error clearing test database:', error);
  } finally {
    await client.release();
  }
});

afterAll(async () => {
  // You might want to add a command to close the connection pool if needed
  // For @vercel/postgres, it's often managed automatically.
}); 