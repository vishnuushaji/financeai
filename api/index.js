import express from 'express';
import { registerRoutes } from '../server/routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize routes
let routesInitialized = false;
async function initializeRoutes() {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  await initializeRoutes();
  
  // Convert Vercel request/response to Express
  await new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
}