import { SurveyModel } from '@/domain/models/survey/survey'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo'
import { mockSurveysModel, mockSurveyModel } from '@/domain/test'
import env from '@/main/config/env'

import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoTest)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  const surveyModelData: SurveyModel = mockSurveyModel()

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  describe('add()', () => {
    test('Should add a survey on success', async () => {
      const sut: SurveyMongoRepository = makeSut()
      await sut.add(surveyModelData)
      const survey = await surveyCollection.findOne({ question: surveyModelData.question })
      expect(survey).toBeTruthy()
    })
  })

  describe('loadAll()', () => {
    test('Should load all survey on success', async () => {
      await surveyCollection.insertMany(mockSurveysModel())
      const sut: SurveyMongoRepository = makeSut()
      const surveys: SurveyModel[] = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[1].question).toBe('other_question')
      expect(surveys[1].id).toBeTruthy()
    })

    test('Should load empty list', async () => {
      const sut: SurveyMongoRepository = makeSut()
      const surveys: SurveyModel[] = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('loadById()', () => {
    test('Should load survey by id on success', async () => {
      const insertResult = (await surveyCollection.insertOne(mockSurveyModel()))
      
      const insertId: string = String(insertResult.insertedId)
      const sut: SurveyMongoRepository = makeSut()
      const survey: SurveyModel = await sut.loadById(insertId)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})