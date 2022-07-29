import { 
  Controller, 
  LoadSurveyById, 
  HttpRequest, 
  HttpResponse, 
  SurveyModel, 
  forbidden, 
  noContent,
  serverError,
  InvalidParamError 
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  
  constructor(private readonly loadSurveyById: LoadSurveyById){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyById: SurveyModel = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
      if (!surveyById) return forbidden(new InvalidParamError('surveyId'))
    } catch (error: any) {
      return serverError(error)
    }
    return noContent()
  }
  
}