import { DbLoadSurveys } from './db-load-surveys'
import { LoadSurveysRepository, SurveyModel } from './db-load-surveys-protocols'
import { throwError, mockSurveysModel } from '@/domain/test'

import MockDate from 'mockdate'
import { mockLoadSurveysRepository } from '@/data/test'

describe('DbLoadSurveys', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })  

  type SutTypes = {
    sut: DbLoadSurveys
    loadSurveysRepositoryStub: LoadSurveysRepository    
  }

  const makeSut = (): SutTypes => {
    const loadSurveysRepositoryStub: LoadSurveysRepository = mockLoadSurveysRepository()
    const sut: DbLoadSurveys = new DbLoadSurveys(loadSurveysRepositoryStub)
    return { sut, loadSurveysRepositoryStub }
  }

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub }: SutTypes = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut }: SutTypes = makeSut()
    const surveys: SurveyModel[] = await sut.load()
    expect(surveys).toEqual(mockSurveysModel())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub }: SutTypes = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise: Promise<SurveyModel[]> = sut.load()
    await expect(promise).rejects.toThrow()
  })

})