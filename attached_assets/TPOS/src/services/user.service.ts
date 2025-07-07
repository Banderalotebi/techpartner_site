import request from 'supertest';
import app from '../src/index';

describe('User API', () => {
  let createdUserId: number;

  it('should create a new user', async () => {
    const res = await request(app).post('/api/users').send({
      name: 'John Doe',
      email: 'john@example.com'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user by id', async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdUserId);
  });

  it('should update user', async () => {
    const res = await request(app).put(`/api/users/${createdUserId}`).send({
      name: 'John Updated'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'John Updated');
  });

  it('should delete user', async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    expect(res.statusCode).toBe(204);
  });
});

