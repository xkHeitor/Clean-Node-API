import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import app from '../config/app'

describe('SignUp Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
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