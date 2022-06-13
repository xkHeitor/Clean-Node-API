import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('Login Routes', () => {

  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'HeyThor',
        email: 'test@mail.com',
        password: '12300',
        passwordConfirmation: '12300'
      })
      .expect(200)
  })

  test('Should return 200 on login', async () => {
    const password: string = await hash('password123', 12)
    await accountCollection.insertOne({
      name: 'Heitor',
      email: 'test@mail.com',
      password
    })
    await request(app).post('/api/login')
      .send({
        email: 'test@mail.com',
        password: 'password123'
      })
      .expect(200)
  })

  test('Should return 401 on login', async () => {
    await request(app).post('/api/login')
      .send({
        email: 'test@mail.com',
        password: 'password123'
      })
      .expect(401)
  })

})