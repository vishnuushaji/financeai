import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import dotenv from 'dotenv';
import http from 'http';

dotenv.config(); // loads .env before anything else

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for Vercel
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

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      // Use console.log for Vercel, log function for development
      if (process.env.NODE_ENV === 'production') {
        console.log(logLine);
      } else {
        // Only import log function in development
        import("./vite").then(({ log }) => log(logLine));
      }
    }
  });

  next();
});

// Initialize routes
let routesInitialized = false;
let server: http.Server | null = null;

async function initializeRoutes(): Promise<http.Server> {
  if (!routesInitialized) {
    server = await registerRoutes(app);
    routesInitialized = true;
    return server;
  }
  return server!;
}

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  console.error(err);
});

// Check if running in Vercel (production serverless environment)
if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
  // Vercel serverless mode - just initialize routes and export app
  (async () => {
    await initializeRoutes();
  })();
} else {
  // Development mode - run the full server
  (async () => {
    const { setupVite, serveStatic, log } = await import("./vite");
    
    const serverInstance = await initializeRoutes();

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, serverInstance);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on the port specified in the environment variable PORT
    // Other ports are firewalled. Default to 5000 if not specified.
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = parseInt(process.env.PORT || '5000', 10);
    serverInstance.listen(port, () => {
      log(`serving on http://localhost:${port}`);
    });
  })();
}

// Export the Express app for Vercel (must be at top level)
export default app;