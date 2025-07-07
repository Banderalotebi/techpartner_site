// === FILE: tests/fraud.test.ts ===
import request from 'supertest';
import app from '../src/index';

describe('Fraud API', () => {
  it('should receive a fraud report', async () => {
    const res = await request(app)
      .post('/api/fraud/report')
      .send({ type: 'fake_invoice', details: 'Suspicious invoice spotted' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBeDefined();
  });
});

// === FILE: tests/deeplink.test.ts ===
describe('DeepLink API', () => {
  it('should generate a deep link', async () => {
    const res = await request(app)
      .post('/api/deeplinks')
      .send({ target: '/services/123', userId: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.link).toContain('/services/123');
  });
});

// === FILE: tests/commission.test.ts ===
describe('Commission API', () => {
  it('should return commission stats', async () => {
    const res = await request(app).get('/api/commissions/stats');

    expect(res.statusCode).toEqual(200);
    expect(res.body.total).toBeGreaterThanOrEqual(0);
  });
});

// === FILE: tests/transparency.test.ts ===
describe('Transparency API', () => {
  it('should fetch transparency logs', async () => {
    const res = await request(app).get('/api/transparency/logs');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.logs)).toBe(true);
  });
});
