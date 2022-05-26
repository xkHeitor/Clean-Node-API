import { badRequest, ok, serverError, unauthorized } from './../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'
import { InvalidParamError, MissingParamError } from '../../errors'

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
      
      const accessToken: string = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorized()

      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }

}