import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'
import { AccountModel } from '@/domain/models/account'
import { MongoHelper } from '../helpers/mongo'
import env from '@/main/config/env'

import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

describe('Survey Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  const answer: string = 'any_answer'

  const surveyModelData: SurveyModel = {
    id: 'any_id',
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: answer
    }],
    date: new Date()
  }

  const makeSurvey = async (): Promise<SurveyModel> => {
    const insertResult = await surveyCollection.insertOne(surveyModelData)
    const res: ReturnType<any> = await surveyCollection.findOne(insertResult.insertedId)
    return res
  }

  const makeAccount = async (): Promise<AccountModel> => {
    const insertResult = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const res: ReturnType<any> = await accountCollection.findOne(insertResult.insertedId)
    return res
  }

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const survey: SurveyModel = await makeSurvey()
      const account: AccountModel = await makeAccount()
      const sut: SurveyResultMongoRepository = makeSut()
      const surveyResult = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: answer,
        date: new Date()
      })

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toEqual(answer)
    })
  })

})