import { AddSurveyParams, AddSurveyRepository } from './add-survey-protocols'
import { DbAddSurvey } from './add-survey'
import { mockAddSurveyRepository } from '@/data/test'
import { throwError } from '@/domain/test'

import MockDate from 'mockdate'

describe('DbAddSurvey UseCase', () => {

  const makeSurveyData = (): AddSurveyParams => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  })

  type SutTypes = {
    sut: DbAddSurvey,
    addSurveyRepositoryStub: AddSurveyRepository
  }

  const makeSut = (): SutTypes => {
    const addSurveyRepositoryStub: AddSurveyRepository = mockAddSurveyRepository()
    const sut: DbAddSurvey = new DbAddSurvey(addSurveyRepositoryStub)
    return { sut, addSurveyRepositoryStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    const surveyData: AddSurveyParams = makeSurveyData()
    await sut.add(surveyData)
    expect(addSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should returns 400 if AddSurveyRepository throws an error', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(throwError)
    const promise: Promise<void> = sut.add(makeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})