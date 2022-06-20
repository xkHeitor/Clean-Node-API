import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'

export default class SignUpController implements Controller {

  constructor(
    private readonly addAccount: AddAccount, 
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = httpRequest.body
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      await this.addAccount.add({ name, email, password })
      const accessToken: string = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }

}