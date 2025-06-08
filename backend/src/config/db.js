import {neon} from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

export const sql = neon(process.env.DATABASE_URL);

export async function connectToDatabase() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
			id SERIAL PRIMARY KEY,
			title VARCHAR NOT NULL,
			user_id VARCHAR(255) NOT NULL,
			amount DECIMAL(10,2) NOT NULL,
			category VARCHAR(255) NOT NULL,
			created_at DATE DEFAULT CURRENT_DATE NOT NULL
		)`;
		console.log("Database connected and table created successfully.");
  } catch (error) {
		console.error("Error connecting to the database:", error);
		process.exit(1);
	}
}