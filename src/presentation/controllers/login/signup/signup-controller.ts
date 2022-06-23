import { AccountModel } from './../../../../domain/models/account'
import { EmailInUseError } from './../../../errors'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../../helpers/http/http-helper'

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
      const account: AccountModel|null = await this.addAccount.add({ name, email, password })
      if (!account) return forbidden(new EmailInUseError())
      const accessToken: string = await this.authentication.auth({ email, password })
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }

}