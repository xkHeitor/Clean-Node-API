import { sign } from 'jsonwebtoken'
import { Collection, InsertOneResult, ObjectId } from 'mongodb'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('Survey Routes', () => {

  let surveyCollection: Collection
  let accountCollection: Collection
  const accountData = {
    name: 'any_name',
    email: 'any_email',
    password: 'any_pass',
    role: 'admin'
  }

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 403 on add survey without accessToken', async () => {
    await request(app).post('/api/surveys')
      .send({
        question: 'Question',
        answers: [{
          answer: 'Answer',
          image: 'http:///image-none.com'
        }]
      })
      .expect(403)
  })

  test('Should return 204 on add survey with valid accessToken', async () => {
    const res: InsertOneResult = await accountCollection.insertOne(accountData)
    const id: string = String(res.insertedId)
    const accessToken = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } }) 
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send({
        question: 'Question',
        answers: [{
          answer: 'Answer',
          image: 'http:///image-none.com'
        }]
      })
      .expect(204)
  })

})