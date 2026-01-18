const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log('DevSecOps Demo Application Started');
  console.log('='.repeat(50));
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Health check: http://${HOST}:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
