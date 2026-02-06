const express = require('express');
const { add, multiply, subtract, divide } = require('./utils/calculator');

// Single place to change for demo: bump version when you deploy a new build
const APP_VERSION = '1.0.0';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 * Used by Docker healthcheck and Kubernetes probes
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'devsecops-demo-app'
  });
});

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'DevSecOps CI/CD Pipeline Demo Application',
    version: APP_VERSION,
    endpoints: {
      health: '/health',
      calculate: '/calculate',
      info: '/info'
    }
  });
});

/**
 * Information endpoint
 */
app.get('/info', (req, res) => {
  res.json({
    application: 'DevSecOps Demo App',
    version: APP_VERSION,
    description: 'Production-grade CI/CD pipeline with security scanning',
    features: [
      'SAST with CodeQL',
      'SCA with OWASP Dependency Check',
      'Container scanning with Trivy',
      'Automated testing',
      'Code quality enforcement'
    ]
  });
});

/**
 * Calculator endpoint
 * POST /calculate
 * Body: { operation: 'add'|'multiply'|'subtract'|'divide', a: number, b: number }
 */
app.post('/calculate', (req, res) => {
  const { operation, a, b } = req.body;
  
  // Input validation
  if (!operation || a === undefined || b === undefined) {
    return res.status(400).json({ 
      error: 'Missing required parameters',
      required: ['operation', 'a', 'b']
    });
  }
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ 
      error: 'Parameters a and b must be numbers'
    });
  }
  
  let result;
  
  try {
    switch (operation) {
      case 'add':
        result = add(a, b);
        break;
      case 'multiply':
        result = multiply(a, b);
        break;
      case 'subtract':
        result = subtract(a, b);
        break;
      case 'divide':
        result = divide(a, b);
        break;
      default:
        return res.status(400).json({ 
          error: 'Invalid operation',
          validOperations: ['add', 'multiply', 'subtract', 'divide']
        });
    }
    
    res.json({ 
      operation,
      operands: { a, b },
      result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
