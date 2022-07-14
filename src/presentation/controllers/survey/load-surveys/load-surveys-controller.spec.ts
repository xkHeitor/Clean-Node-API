import { LoadSurveysController } from './load-surveys-controller'
import { SurveyModel, LoadSurveys, HttpResponse } from './load-surveys-controller-protocols'

import MockDate from 'mockdate'
import { ok } from '../../../helpers/http/http-helper'

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

})