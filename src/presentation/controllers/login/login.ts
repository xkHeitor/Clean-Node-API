import { MissingParamError } from './../../errors/missing-param-error'
import { badRequest, ok } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) return badRequest(new MissingParamError('email'))
    if (!httpRequest.body.password) return badRequest(new MissingParamError('password'))
    const result = ok(true)
    return new Promise(resolve => resolve(result))  
  }

}