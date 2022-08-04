import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey/save-survey-result'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SurveyModel } from '@/domain/models/survey/survey'
import { AccountModel } from '@/domain/models/account/account'
import { MongoHelper } from '../helpers/mongo'
import env from '@/main/config/env'

import { Collection, InsertOneResult } from 'mongodb'
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
    const insertResult: InsertOneResult = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    const res: ReturnType<any> = await accountCollection.findOne(insertResult.insertedId)
    return res
  }

  const makeSurveyResult = async (saveSurveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> => {
    const insertResult: InsertOneResult = await surveyResultCollection.insertOne(saveSurveyResult)
    const res: ReturnType<any> = await surveyResultCollection.findOne(insertResult.insertedId)
    return res && MongoHelper.map(res)
  }

  const makeSaveSurveyResult = async (): Promise<SaveSurveyResultParams> => {
    const survey: SurveyModel = await makeSurvey()
    const account: AccountModel = await makeAccount()
    return {
      surveyId: survey.id,
      accountId: account.id,
      answer: answer,
      date: new Date()
    }
  }

  const makeSut = (): SurveyResultMongoRepository => {
    return new SurveyResultMongoRepository()
  }

  describe('save()', () => {
   
    test('Should add a survey result if its new', async () => {
      const sut: SurveyResultMongoRepository = makeSut()
      const saveSurveyResult: SaveSurveyResultParams = await makeSaveSurveyResult()
      const surveyResult: SurveyResultModel = await sut.save(saveSurveyResult)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toEqual(answer)
    })

    test('Should update survey result if its not new', async () => {
      const saveSurveyResult: SaveSurveyResultParams = await makeSaveSurveyResult()
      const firstSurveyResult = await makeSurveyResult(saveSurveyResult)
      
      const answerEdited: string = 'edit_answer'
      const saveSurveyResultUpdated = Object.assign({}, saveSurveyResult, { answer: answerEdited })
      const sut: SurveyResultMongoRepository = makeSut()
      const surveyResult: SurveyResultModel = await sut.save(saveSurveyResultUpdated)

      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answer).toEqual(answerEdited)
      expect(surveyResult.id).not.toBeNull()
      expect(surveyResult.id).toEqual(firstSurveyResult.id)
    })

  })

})