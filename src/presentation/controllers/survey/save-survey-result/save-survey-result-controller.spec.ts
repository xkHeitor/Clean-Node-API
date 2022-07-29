import { SaveSurveyResultController } from './save-survey-result-controller'
import { 
  HttpRequest, 
  HttpResponse, 
  LoadSurveyById, 
  SurveyModel, 
  forbidden, 
  InvalidParamError,
  serverError
} from './save-survey-result-controller-protocols'

describe('SafeSurveyResult Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'any_answer'
    }
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

  const makeLoadSurveyById = (): LoadSurveyById => {
    class LoadSurveyByIdStub implements LoadSurveyById {
      async loadById(id: string): Promise<SurveyModel> {
        return new Promise(resolve => resolve(makeFakeSurvey()))
      }
    }
    return new LoadSurveyByIdStub()
  }

  type SutType = {
    sut: SaveSurveyResultController
    loadSurveyByIdStub: LoadSurveyById
  }

  const makeSut = (): SutType => {
    const loadSurveyByIdStub: LoadSurveyById = makeLoadSurveyById()
    const sut: SaveSurveyResultController = new SaveSurveyResultController(loadSurveyByIdStub)
    return { sut, loadSurveyByIdStub }
  }

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

})