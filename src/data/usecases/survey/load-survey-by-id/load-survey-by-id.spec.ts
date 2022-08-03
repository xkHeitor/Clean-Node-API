import { LoadSurveyByIdRepository, SurveyModel } from './load-survey-by-id-protocols'
import { DbLoadSurveyById } from './load-survey-by-id'

import MockDate from 'mockdate'
import { throwError, mockSurveyModel } from '@/domain/test'
import { mockLoadSurveyByIdRepository } from '@/data/test'

describe('DbLoadSurveyById', () => {

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  const anyId: string = 'any_id'

  type SutTypes = {
    sut: DbLoadSurveyById
    loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
  }

  const makeSut = (): SutTypes => {
    const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
    const sut: DbLoadSurveyById = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)
    return { sut, loadSurveyByIdRepositoryStub }
  }

  test('Should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub }: SutTypes = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById(anyId)
    expect(loadByIdSpy).toHaveBeenCalledWith(anyId)
  })

  test('Should return Surveys on success', async () => {
    const { sut }: SutTypes = makeSut()
    const survey: SurveyModel = await sut.loadById(anyId)
    expect(survey).toEqual(mockSurveyModel())
  })

  test('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub }: SutTypes = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockImplementationOnce(throwError)
    const promise: Promise<SurveyModel> = sut.loadById(anyId)
    await expect(promise).rejects.toThrow()
  })

})