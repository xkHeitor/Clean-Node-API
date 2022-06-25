import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo'

import { SurveyMongoRepository } from './survey-mongo-repository'
import env from '../../../../main/config/env'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {

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

  const surveyModelData = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  test('Should add a survey on success', async () => {
    const sut: SurveyMongoRepository = makeSut()
    await sut.add(surveyModelData)
    const survey = await surveyCollection.findOne({ question: surveyModelData.question })
    expect(survey).toBeTruthy()
  })

})