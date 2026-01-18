const request = require('supertest');
const app = require('../src/app');

describe('API Endpoints', () => {
  
  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('service', 'devsecops-demo-app');
    });
  });
  
  describe('GET /', () => {
    test('should return application information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });
  
  describe('GET /info', () => {
    test('should return detailed application info', async () => {
      const response = await request(app).get('/info');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('application', 'DevSecOps Demo App');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('features');
      expect(Array.isArray(response.body.features)).toBe(true);
    });
  });
  
  describe('POST /calculate', () => {
    test('should add two numbers correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 5, b: 3 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(8);
      expect(response.body.operation).toBe('add');
    });
    
    test('should subtract two numbers correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'subtract', a: 10, b: 4 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(6);
    });
    
    test('should multiply two numbers correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'multiply', a: 6, b: 7 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(42);
    });
    
    test('should divide two numbers correctly', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 10, b: 2 });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(5);
    });
    
    test('should return error for division by zero', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'divide', a: 10, b: 0 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    test('should return error for invalid operation', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'invalid', a: 5, b: 3 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    test('should return error for missing parameters', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 5 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
    
    test('should return error for non-numeric parameters', async () => {
      const response = await request(app)
        .post('/calculate')
        .send({ operation: 'add', a: 'five', b: 3 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
  
  describe('GET /nonexistent', () => {
    test('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
    });
  });
});
