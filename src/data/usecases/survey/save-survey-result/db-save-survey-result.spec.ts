import { SurveyResultModel, SaveSurveyResultRepository, SaveSurveyResultParams } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'

describe('DbSaveSurveyResult UseCase', () => {

  const makeFakeSurveyResultData = (): SaveSurveyResultParams => ({
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  })

  const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSurveyResultData(), { id: 'any_id' })

  const makeSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
    class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
      async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        return new Promise(resolve => resolve(makeFakeSurveyResult()))
      }
    }
    return new SaveSurveyResultRepositoryStub()
  }

  type SutTypes = {
    sut: DbSaveSurveyResult,
    saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  }

  const makeSut = (): SutTypes => {
    const saveSurveyResultRepositoryStub: SaveSurveyResultRepository = makeSaveSurveyResultRepository()
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
    const surveyData: SaveSurveyResultParams = makeFakeSurveyResultData()
    await sut.save(surveyData)
    expect(saveSpy).toHaveBeenCalledWith(surveyData)
  })

  test('Should returns 400 if SaveSurveyResultRepository throws an error', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const rejectPromise: Promise<SurveyResultModel> = new Promise((resolve, reject) => reject(new Error()))
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(rejectPromise)
    const promise: Promise<SurveyResultModel> = sut.save(makeFakeSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResultData: SurveyResultModel = await sut.save(makeFakeSurveyResultData())
    expect(surveyResultData).toEqual(makeFakeSurveyResult())
  })

})