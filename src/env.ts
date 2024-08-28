import dotenv from 'dotenv';

// Load .env file into process.env
dotenv.config();

// Access the database connection URL
const databaseUrl = process.env.DATABASE_URL;

// Use the database URL in your application to connect to PostgreSQL
console.log('Connecting to:', databaseUrl);

