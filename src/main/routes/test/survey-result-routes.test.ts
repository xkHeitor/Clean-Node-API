import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo'
import app from '@/main/config/app'
import env from '@/main/config/env'

import { Collection, InsertOneResult, ObjectId } from 'mongodb'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('Survey Routes', () => {

  let surveyCollection: Collection
  let accountCollection: Collection
 
  const accountData = {
    name: 'any_name',
    email: 'any_email',
    password: 'any_pass'
  }

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
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }))
      await request(app).put(`/api/surveys/${String(insertResult.insertedId)}/results`)
        .set('x-access-token', await makeAccessToken(accountData))
        .send({ answer: 'other_answer' })
        .expect(200)
    })

  })

})