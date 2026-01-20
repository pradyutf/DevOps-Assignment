import express, { Application, Request, Response, NextFunction } from 'express';
import todoRoutes from './routes/todo.routes';

/**
 * Express Application Factory
 * 
 * WHY SEPARATE app.ts FROM index.ts?
 * - Enables testing without starting the server
 * - app.ts exports the Express app for supertest
 * - index.ts starts the server (not imported in tests)
 * 
 * VIVA NOTE: This separation is a testing best practice.
 * It allows integration tests to import the app directly.
 */

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Health Check Endpoint
 * 
 * CRITICAL FOR KUBERNETES!
 * - Liveness Probe: Is the container alive?
 * - Readiness Probe: Is the container ready to receive traffic?
 * 
 * VIVA NOTE: Without health endpoints, Kubernetes cannot:
 * - Automatically restart unhealthy containers
 * - Route traffic only to healthy pods
 * - Perform rolling updates safely
 */
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Root endpoint - API information
 */
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Todo API',
    version: '1.0.0',
    description: 'Production-grade Todo API with CI/CD Pipeline',
    endpoints: {
      health: 'GET /health',
      todos: {
        list: 'GET /api/todos',
        get: 'GET /api/todos/:id',
        create: 'POST /api/todos',
        update: 'PUT /api/todos/:id',
        delete: 'DELETE /api/todos/:id',
      },
    },
  });
});

// API Routes
app.use('/api/todos', todoRoutes);

/**
 * 404 Handler - Route not found
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

/**
 * Global Error Handler
 * 
 * VIVA NOTE: Centralized error handling:
 * - Prevents server crashes from unhandled errors
 * - Provides consistent error response format
 * - Logs errors for debugging (in production, use proper logging)
 */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

export default app;
