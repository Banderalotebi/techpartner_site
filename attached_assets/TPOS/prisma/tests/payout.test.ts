import request from 'supertest';
import app from '../src/index';

describe('Payout API', () => {
  let payoutId: number;

  it('should create a new payout', async () => {
    const res = await request(app).post('/api/payouts').send({
      userId: 1,
      amount: 100,
      status: 'pending'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    payoutId = res.body.id;
  });

  it('should get all payouts', async () => {
    const res = await request(app).get('/api/payouts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get payout by id', async () => {
    const res = await request(app).get(`/api/payouts/${payoutId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', payoutId);
  });

  it('should update payout', async () => {
    const res = await request(app).put(`/api/payouts/${payoutId}`).send({
      status: 'completed'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should delete payout', async () => {
    const res = await request(app).delete(`/api/payouts/${payoutId}`);
    expect(res.statusCode).toBe(204);
  });
});
