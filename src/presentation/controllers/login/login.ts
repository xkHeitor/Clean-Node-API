import { EmailValidator } from './../../protocols/email-validator'
import { MissingParamError } from './../../errors/missing-param-error'
import { badRequest, ok } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'

export class LoginController implements Controller {

  constructor(private readonly emailValidator: EmailValidator){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body
    if (!email) return badRequest(new MissingParamError('email'))
    if (!password) return badRequest(new MissingParamError('password'))
    this.emailValidator.isValid(email)
    const result = ok(true)
    return new Promise(resolve => resolve(result))  
  }

}