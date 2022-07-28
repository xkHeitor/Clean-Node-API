import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models/survey/survey'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo'
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

  const surveyModelData = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }

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
      await surveyCollection.insertMany([surveyModelData, {
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }])
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
      const insertResult = (await surveyCollection.insertOne({
        question: 'other_question',
        answers: [{
          image: 'other_image',
          answer: 'other_answer'
        }],
        date: new Date()
      }))
      
      const insertId: string = String(insertResult.insertedId)
      const sut = makeSut()
      const survey = await sut.loadById(insertId)
      expect(survey).toBeTruthy()
      expect(survey.id).toBeTruthy()
    })
  })
})