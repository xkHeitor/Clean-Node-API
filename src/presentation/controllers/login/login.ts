import { Authentication } from './../../../domain/usecases/authentication'
import { EmailValidator } from './../../protocols/email-validator'
import { MissingParamError } from './../../errors/missing-param-error'
import { badRequest, ok, serverError } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError } from '../../errors'

export class LoginController implements Controller {

  constructor(private readonly emailValidator: EmailValidator, private readonly authentication: Authentication){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) return badRequest(new MissingParamError('email'))
      if (!password) return badRequest(new MissingParamError('password'))
      const validEmail: boolean = this.emailValidator.isValid(email)
      if (!validEmail) return badRequest(new InvalidParamError('email'))
      const authentication: string = await this.authentication.auth(email, password)
      return ok(authentication)
    } catch (error: any) {
      return serverError(error)
    }
  }

}