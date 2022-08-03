import { mockAddAccountParams } from '@/domain/test'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo'
import app from '@/main/config/app'
import env from '@/main/config/env'

import { sign } from 'jsonwebtoken'
import { Collection, InsertOneResult, ObjectId } from 'mongodb'
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

  const makeRequestData = (): any => {
    return {
      question: 'any_question',
      answers: [{
        answer: 'any_answer',
        image: 'http:///image-none.com'
      }]
    }
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

  describe('POST', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app).post('/api/surveys')
        .send(makeRequestData())
        .expect(403)
    })
  
    test('Should return 204 on add survey with valid accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', await makeAccessToken(Object.assign({}, mockAddAccountParams(), { role: 'admin' })))
        .send(makeRequestData())
        .expect(204)
    })
  })

  describe('GET', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 200 on load survey with valid accessToken', async () => {
      await surveyCollection.insertMany([makeRequestData()])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', await makeAccessToken(Object.assign({}, mockAddAccountParams(), { role: undefined })))
        .expect(200)
    })
  })

})