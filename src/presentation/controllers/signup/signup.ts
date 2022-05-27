import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount, AccountModel, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'

export default class SignUpController implements Controller {

  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount, private readonly validation: Validation) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirmation } = httpRequest.body
    if (password !== passwordConfirmation) { return badRequest(new InvalidParamError('passwordConfirmation')) }

    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)
      const emailIsValid: boolean = this.emailValidator.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidParamError('email'))
      const account: AccountModel = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }

}