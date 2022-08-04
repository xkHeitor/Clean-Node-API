import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo'
import { mockAccountData } from '@/domain/test'
import app from '@/main/config/app'
import env from '@/main/config/env'

import { Collection, InsertOneResult, ObjectId } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('Survey Routes', () => {

  let surveyCollection: Collection
  let accountCollection: Collection

  const makeAccessToken = async (account): Promise<string> => {
    const res: InsertOneResult = await accountCollection.insertOne(account)
    const id: string = String(res.insertedId)
    const accessToken: string = sign({ id }, env.jwtSecret)
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } }) 
    return accessToken
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

  describe('PUT /survey/:surveyId/results', () => {

    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app).put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result with accessToken', async () => {
      const insertResult: InsertOneResult = (await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }))
      await request(app).put(`/api/surveys/${String(insertResult.insertedId)}/results`)
        .set('x-access-token', await makeAccessToken(mockAccountData()))
        .send({ answer: 'any_answer' })
        .expect(200)
    })

  })

})