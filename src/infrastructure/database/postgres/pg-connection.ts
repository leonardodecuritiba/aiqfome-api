import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

export const createClientsTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS clients (
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      favorites JSONB DEFAULT '[]'::jsonb,
      apiKey UUID NOT NULL
    );
  `;
    try {
        await pool.query(queryText);
        console.log('"clients" table is ready.');
    } catch (err) {
        console.error('Error creating "clients" table:', err);
        process.exit(1);
    }
};
