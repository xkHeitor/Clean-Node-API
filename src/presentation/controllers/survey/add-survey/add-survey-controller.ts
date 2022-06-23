import { badRequest, ok } from './../../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Controller, Validation } from './add-survey-controller-protocols'

export class AddSurveyController implements Controller {
  
  constructor (private readonly validation: Validation){}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error: Error|undefined = this.validation.validate(httpRequest.body)
    if (error) return badRequest(error)
    return new Promise(resolve => resolve(ok(null)))
  }
  
}