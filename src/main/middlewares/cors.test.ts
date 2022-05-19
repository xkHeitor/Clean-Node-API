import request from 'supertest'
import app from '../config/app';

describe('Cors Middleware', () => {

  const route: string = '/test_cors';

  test('Should enable cors', async () => {
    app.get(route, (req, res) => res.send());
    await request(app).get(route)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-headers', '*')
      .expect('access-control-allow-methods', '*');
  });

});