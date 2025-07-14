import request from 'supertest';
import express from 'express';
import { app } from '../app.js';

describe('User API Endpoints', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(0, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Health check route should return running message', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('My Dashboard is Running');
  });

  test('Register user should fail with missing fields', async () => {
    const res = await request(server)
      .post('/api/v1/user/register')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Login should fail with missing credentials', async () => {
    const res = await request(server)
      .post('/api/v1/user/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('OTP verification should fail with missing fields', async () => {
    const res = await request(server)
      .post('/api/v1/user/otp-verification')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Forgot password should fail with missing email', async () => {
    const res = await request(server)
      .post('/api/v1/user/password/forgot')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('Reset password should fail with missing fields', async () => {
    const res = await request(server)
      .put('/api/v1/user/password/reset/sometoken')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
