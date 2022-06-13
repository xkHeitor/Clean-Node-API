import { badRequest, ok, serverError, unauthorized } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols'

export class LoginController implements Controller {

  constructor(private readonly authentication: Authentication, private readonly validation: Validation){}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error: Error|undefined = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const { email, password } = httpRequest.body      
      const accessToken: string = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorized()
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }

}