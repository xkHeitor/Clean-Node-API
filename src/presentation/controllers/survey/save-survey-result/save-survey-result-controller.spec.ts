import { HttpRequest, LoadSurveyById, SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'

describe('SafeSurveyResult Controller', () => {

  const makeFakeRequest = (): HttpRequest => ({
    params: {
      surveyId: 'any_id'
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

})