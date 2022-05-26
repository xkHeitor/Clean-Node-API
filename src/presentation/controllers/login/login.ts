import { Authentication } from './../../../domain/usecases/authentication'
import { EmailValidator } from './../../protocols/email-validator'
import { MissingParamError } from './../../errors/missing-param-error'
import { badRequest, ok, serverError, unauthorized } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError } from '../../errors'

export class LoginController implements Controller {

  constructor(private readonly emailValidator: EmailValidator, private readonly authentication: Authentication){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields: string[] = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      
      const { email, password } = httpRequest.body
      const validEmail: boolean = this.emailValidator.isValid(email)
      if (!validEmail) return badRequest(new InvalidParamError('email'))
      
      const authentication: string = await this.authentication.auth(email, password)
      if (!authentication) return unauthorized()

      return ok(authentication)
    } catch (error: any) {
      return serverError(error)
    }
  }

}