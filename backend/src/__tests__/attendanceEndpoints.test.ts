import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';
import { resetState } from '../services/attendanceService';

describe('Attendance API Endpoints', () => {
  beforeEach(() => {
    resetState();
  });

  describe('POST /attendances', () => {
    it('should create an attendance and return 201 with valid payload', async () => {
      const response = await request(app)
        .post('/attendances')
        .send({ customerName: 'Client Test', subject: 'Problemas com cartão' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('attendance');
      expect(response.body.attendance).toHaveProperty('id');
      expect(response.body.attendance.customerName).toBe('Client Test');
      expect(response.body.attendance.subject).toBe('Problemas com cartão');
    });

    it('should return 400 when body does not contain customerName or subject', async () => {
      const response = await request(app)
        .post('/attendances')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when fields are not strings', async () => {
      const response = await request(app)
        .post('/attendances')
        .send({ customerName: 123, subject: 'Problemas com cartão' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('customerName and subject must be strings');
    });
  });

  describe('POST /attendances/:id/finish', () => {
    it('should finish an active attendance and return 200', async () => {
      // First create one
      const createResponse = await request(app)
        .post('/attendances')
        .send({ customerName: 'Client', subject: 'Problemas com cartão' });

      const attendanceId = createResponse.body.attendance.id;

      const response = await request(app)
        .post(`/attendances/${attendanceId}/finish`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('finished');
      expect(response.body.finished.status).toBe('FINISHED');
      expect(response.body.finished.finishedAt).not.toBeNull();
    });

    it('should return 404 when finishing a non-existent attendance', async () => {
      const response = await request(app)
        .post('/attendances/non-existent-uuid/finish')
        .send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Attendance not found');
    });
  });

  describe('GET /teams', () => {
    it('should return 200 with the list of teams', async () => {
      const response = await request(app).get('/teams').send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('teams');
      expect(Array.isArray(response.body.teams)).toBe(true);
      expect(response.body.teams.length).toBeGreaterThan(0);
    });
  });

  describe('GET /health', () => {
    it('should return 200 with status: ok', async () => {
      const response = await request(app).get('/health').send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /dashboard', () => {
    it('should return 200 and response contains summary', async () => {
      const response = await request(app).get('/dashboard').send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalActive');
      expect(response.body.summary).toHaveProperty('totalQueued');
      expect(response.body.summary).toHaveProperty('totalFinished');
    });
  });
});
