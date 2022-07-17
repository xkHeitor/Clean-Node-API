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

  describe('POST', () => {
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
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', await makeAccessToken(accountData))
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

  describe('GET', () => {
    test('Should return 403 on load survey without accessToken', async () => {
      await request(app).get('/api/surveys').expect(403)
    })

    test('Should return 200 on load survey with valid accessToken', async () => {
      await surveyCollection.insertMany([{
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      }])
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', await makeAccessToken(Object.assign({}, accountData, { role: undefined })))
        .expect(200)
    })
  })

})