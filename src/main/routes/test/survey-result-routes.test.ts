import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo'
import app from '@/main/config/app'
import env from '@/main/config/env'

import { Collection } from 'mongodb'
import request from 'supertest'

describe('Survey Routes', () => {

  let surveyCollection: Collection
  let accountCollection: Collection
 
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

  describe('PUT /survey/:surveyId/results', () => {

    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

  })

})