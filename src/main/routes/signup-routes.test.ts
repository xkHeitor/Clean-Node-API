import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {

  const route: string = '/api/signup'
  test('Should return an account on success', async () => {
    await request(app).post(route)
      .send({
        name: 'HeyThor',
        email: 'test@mail.com',
        password: '12300',
        passwordConfirmation: '12300'
      })
      .expect(200)
  })

})