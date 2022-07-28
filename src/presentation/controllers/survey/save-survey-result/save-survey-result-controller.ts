import { InvalidParamError } from './../../../errors/invalid-param-error'
import { 
  Controller, 
  LoadSurveyById, 
  HttpRequest, 
  HttpResponse, 
  SurveyModel, 
  forbidden, 
  noContent 
} from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  
  constructor(private readonly loadSurveyById: LoadSurveyById){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyById: SurveyModel = await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    if (!surveyById) return forbidden(new InvalidParamError('surveyId'))
    return noContent()
  }
  
}