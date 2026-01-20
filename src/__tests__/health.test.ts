import request from 'supertest';
import app from '../app';

/**
 * Health Endpoint Tests
 * 
 * WHY THIS TEST?
 * - Health endpoint is CRITICAL for Kubernetes
 * - K8s uses it to know if container is alive
 * - If this fails, K8s restarts the container
 */

describe('Health Check', () => {
  it('should return healthy status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});

describe('Root Endpoint', () => {
  it('should return API info', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Todo API');
  });
});
