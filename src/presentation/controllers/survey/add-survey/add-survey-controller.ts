import { badRequest, noContent, serverError } from './../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Controller, Validation, AddSurvey } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  
  constructor (private readonly validation: Validation, private readonly addSurvey: AddSurvey){}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error: Error|undefined = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)
    const { question, answers } = httpRequest.body
    
    try {
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
  
}