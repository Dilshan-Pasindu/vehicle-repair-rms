'use strict';

const request = require('supertest');
const app     = require('../server');

describe('Health Check Integration API', () => {
  test('GET /health returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      service: 'VSRMS API',
    });
  });

  test('GET / root returns 200 and status ok', async () => {
    const res = await request(app).get('/');
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /unknown-route returns 404', async () => {
    const res = await request(app).get('/api/v1/unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
