import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema/schema';

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Test the database connection with retries and exponential backoff
const testConnection = async (retries = 5, baseDelay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sql`SELECT 1`;
      console.log('Database connection successful');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, i) * (0.5 + Math.random());
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Initialize drizzle with the schema
export const db = drizzle(sql, { schema });

// Test connection on initialization with retries
if (process.env.NODE_ENV === 'production') {
  testConnection().catch(error => {
    console.error('Final database connection error:', error);
    // Don't throw here to prevent crashing the app, but log the error
  });
}

// Export schema for use in other files
export * from './schema/schema'; 