import supertest from 'supertest';
import app from '../src/expressApp';
const st = supertest(app);

describe('User Endpoints', () => {
  it('Should create user', async () => {
    const res = await st
      .post('/auth/signup')
      .send({ email: 'example@example.com', password: 'securePassword123' });

    expect(res.status).toEqual(200);
  });
});
