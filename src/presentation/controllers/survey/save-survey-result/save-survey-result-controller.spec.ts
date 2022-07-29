import { SaveSurveyResultController } from './save-survey-result-controller'
import { 
  HttpRequest, 
  HttpResponse, 
  LoadSurveyById, 
  SurveyModel, 
  forbidden, 
  InvalidParamError,
  serverError,
  SurveyResultModel,
  SaveSurveyResult,
  SaveSurveyResultModel
} from './save-survey-result-controller-protocols'

import MockDate from 'mockdate'

describe('SafeSurveyResult Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_survey_id'
    },
    body: {
      answer: 'any_answer'
    },
    accountId: 'any_account_id'
  })
  
  const makeFakeSurvey = (): SurveyModel => {
    return {
      id: 'any_id',
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  }

  const makeFakeSurveyResultModel = (): SurveyResultModel => ({
    id: 'any_id',
    accountId: 'any_account_id',
    surveyId: 'any_survey_id',
    answer: 'any_answer',
    date: new Date()
  })

  const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
      async loadById(id: string): Promise<SurveyModel> {
        return new Promise(resolve => resolve(makeFakeSurvey()))
      }
    }
    return new LoadSurveyByIdStub()
  }

  const makeSaveSurveyResult = (): SaveSurveyResult => {
    class SaveSurveyResultStub implements SaveSurveyResult {
      async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
        return new Promise(resolve => resolve(makeFakeSurveyResultModel()))
      }

    }
    return new SaveSurveyResultStub()
  }

  type SutType = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
    saveSurveyResultStub: SaveSurveyResult
  }

  const makeSut = (): SutType => {
    const loadSurveyByIdStub: LoadSurveyById = makeLoadSurveyById()
    const saveSurveyResultStub: SaveSurveyResult = makeSaveSurveyResult()
    const sut: SaveSurveyResultController = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)
    return { sut, loadSurveyByIdStub, saveSurveyResultStub }
  }

  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveyById', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)
    expect(loadByIdSpy).toHaveBeenCalledWith(request.params.surveyId)
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const mockResponse: Promise<SurveyModel> = new Promise(resolve => resolve(null)) 
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(mockResponse)
    const request: HttpRequest = makeFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({
      params: {
        surveyId: 'any_id'
      },
      body: {
        answer: 'wrong_answer'
      }
    })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    const error: Error = new Error()
    const errorPromise: Promise<SurveyModel> = new Promise((resolve, reject) => reject(error))
    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(errorPromise)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(error))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const request: HttpRequest = makeFakeRequest()
    await sut.handle(request)
    expect(saveSpy).toHaveBeenCalledWith({
      surveyId: 'any_survey_id',
      accountId: 'any_account_id',
      date: new Date(),
      answer: 'any_answer'
    })
  })

})