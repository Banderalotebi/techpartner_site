import request from 'supertest';
import app from '../src/index';

describe('Order API', () => {
  let orderId: number;

  it('should create a new order', async () => {
    const res = await request(app).post('/api/orders').send({
      userId: 1,
      serviceId: 1,
      status: 'pending'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    orderId = res.body.id;
  });

  it('should get all orders', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get order by id', async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', orderId);
  });

  it('should update order', async () => {
    const res = await request(app).put(`/api/orders/${orderId}`).send({
      status: 'completed'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should delete order', async () => {
    const res = await request(app).delete(`/api/orders/${orderId}`);
    expect(res.statusCode).toBe(204);
  });
});
