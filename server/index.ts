import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

      log(logLine);
    }
  });

  next();
});

// Convert ES module URL to __dirname for production static serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // In development mode, use Vite middleware
    await setupVite(app, server);
  } else {
    // In production mode, serve static assets from dist/public
    const publicDir = path.join(__dirname, "public");
    console.log(`🔹 Serving static files from: ${publicDir}`);
    app.use(express.static(publicDir));
    // SPA fallback: serve index.html for unmatched routes
    app.get("*", (_req, res) => {
      res.sendFile(path.join(publicDir, "index.html"));
    });
  }

  // Determine the port to listen on (default: 5000 or use PORT env var)
  // This serves both the API and the client; default port 5000 is used unless overridden.
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
  // Handle server errors (e.g., port already in use)
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use. Is another instance running?`, 'express');
      process.exit(1);
    }
    log(`Server error: ${err.message}`, 'express');
    process.exit(1);
  });
  // Start server on port 5000, binding to all interfaces.
  server.listen({ port, host: "0.0.0.0" }, () => {
    log(`serving on port ${port}`, 'express');
  });
})();
