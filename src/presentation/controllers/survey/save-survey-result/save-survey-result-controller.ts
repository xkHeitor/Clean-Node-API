import { Controller, LoadSurveyById, HttpRequest, HttpResponse } from './save-survey-result-controller-protocols'
import { noContent } from '@/presentation/helpers/http/http-helper'

export class SaveSurveyResultController implements Controller {
  
  constructor(private readonly loadSurveyById: LoadSurveyById){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveyById.loadById(httpRequest.params.surveyId)
    return noContent()
  }
  
}