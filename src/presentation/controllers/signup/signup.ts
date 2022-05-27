import { Controller, HttpRequest, HttpResponse, AddAccount, AccountModel, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export default class SignUpController implements Controller {

  constructor(private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = httpRequest.body
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const account: AccountModel = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }

}