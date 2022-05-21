import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import app from '../config/app'
import env from '../config/env'

describe('SignUp Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

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