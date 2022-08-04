import { serverError, ok, noContent } from './../../../helpers/http/http-helper'
import { LoadSurveysController } from './load-surveys-controller'
import { LoadSurveys, HttpResponse } from './load-surveys-controller-protocols'
import { mockSurveysModel, throwError } from '@/domain/test'
import { mockLoadSurveysStub } from '@/presentation/test'

import MockDate from 'mockdate'

describe('LoadSurveys Controller', () => {

  type SutTypes = {
    sut: LoadSurveysController
    loadSurveysStub: LoadSurveys
  }

  const makeSut = (): SutTypes => {
    const loadSurveysStub: LoadSurveys = mockLoadSurveysStub()
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
    expect(httpResponse).toEqual(ok(mockSurveysModel()))
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse: HttpResponse = await sut.handle({})
    const error: Error = new Error()
    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should call loadSurveys and return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

})