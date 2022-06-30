import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo'
import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

describe('Survey Routes', () => {

  let surveyCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
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

})