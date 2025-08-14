import dotenv from 'dotenv';
dotenv.config(); // ensures .env is loaded

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Use WebSocket constructor for serverless Neon
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL exists
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing! Please set it in your .env file.");
  process.exit(1); // exit gracefully instead of throwing
}

// Create a Neon Pool
export const pool = new Pool({
  connectionString: DATABASE_URL,
  // optional SSL config if needed
  ssl: {
    rejectUnauthorized: true,
  },
});

// Initialize Drizzle ORM
export const db = drizzle({
  client: pool,
  schema,
});

console.log("✅ Connected to Neon database successfully.");
