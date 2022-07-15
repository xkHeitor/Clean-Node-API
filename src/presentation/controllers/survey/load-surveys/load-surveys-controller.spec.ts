import { serverError, ok, noContent } from './../../../helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys, HttpResponse } from './load-surveys-controller-protocols'

import MockDate from 'mockdate'

describe('LoadSurveys Controller', () => {

  const makeFakeSurveys = (): SurveyModel [] => {
    return [{
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }, {
      id: 'other_id',
      question: 'other_question',
      answers: [{
        image: 'other_image',
        answer: 'other_answer'
      }],
      date: new Date()
    }]
  } 

  const makeLoadSurveysStub = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
      async load(): Promise<SurveyModel[]> {
        return new Promise(resolve => resolve(makeFakeSurveys()))
      }
    }
    return new LoadSurveysStub()
  }

  interface SutTypes {
    sut: LoadSurveysController
    loadSurveysStub: LoadSurveys
  }

  const makeSut = (): SutTypes => {
    const loadSurveysStub: LoadSurveys = makeLoadSurveysStub()
    const sut: LoadSurveysController = new LoadSurveysController(loadSurveysStub)
    return { sut, loadSurveysStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call loadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should call loadSurveys and return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const error: Error = new Error()
    const errorPromise: Promise<SurveyModel[]> = new Promise((resolve, reject) => reject(error))
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(errorPromise)
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should call loadSurveys and return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

})