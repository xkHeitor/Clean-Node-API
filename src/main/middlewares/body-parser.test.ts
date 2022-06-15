import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {

  const route: string = '/test_body_parser'

  test('Should parse body as json', async () => {
    await app.post(route, (req, res) => res.send(req.body))
    const body = { name: 'any_name' }
    await request(app).post(route).send(body).expect(body)
  })

})