import { SurveyResultModel, SaveSurveyResultRepository, SaveSurveyResultParams } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockSurveyResultModel, mockSurveyResultParams, throwError } from '@/domain/test'
import { mockSaveSurveyResultRepository } from '@/data/test'

describe('DbSaveSurveyResult UseCase', () => {

  type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  }

  const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub: SaveSurveyResultRepository = mockSaveSurveyResultRepository()
    const sut: DbSaveSurveyResult = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)
    return { sut, saveSurveyResultRepositoryStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const surveyData: SaveSurveyResultParams = mockSurveyResultParams()
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should returns 400 if SaveSurveyResultRepository throws an error', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise: Promise<SurveyResultModel> = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData: SurveyResultModel = await sut.save(mockSurveyResultParams())
    expect(surveyResultData).toEqual(mockSurveyResultModel())
  })

})