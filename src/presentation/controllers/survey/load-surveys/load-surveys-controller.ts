import { ok } from './../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, LoadSurveys, SurveyModel } from './load-surveys-controller-protocols'

export class LoadSurveysController implements Controller {
  
  constructor(private readonly loadSurveys: LoadSurveys){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveys: SurveyModel[] = await this.loadSurveys.load()
    return ok(surveys)
  }

}