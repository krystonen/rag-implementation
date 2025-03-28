import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
      
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT,
        embedding vector(1536)
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
