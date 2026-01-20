import app from './app';

/**
 * Server Entry Point
 * 
 * WHY SEPARATE FROM app.ts?
 * - app.ts: Express configuration (testable)
 * - index.ts: Server startup (not imported in tests)
 * 
 * This separation allows supertest to test the app
 * without actually starting a server on a port.
 */

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`
  🚀 Todo API Server Started!
  
  📍 URL: http://localhost:${PORT}
  🏥 Health: http://localhost:${PORT}/health
  📝 Todos: http://localhost:${PORT}/api/todos
  
  Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

/**
 * Graceful Shutdown Handler
 * 
 * VIVA NOTE: Graceful shutdown is crucial for:
 * - Kubernetes rolling updates (SIGTERM signal)
 * - Completing in-flight requests before exit
 * - Cleaning up resources (DB connections, etc.)
 * 
 * Without this, you'd lose requests during deployments!
 */
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });

  // Force exit after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
