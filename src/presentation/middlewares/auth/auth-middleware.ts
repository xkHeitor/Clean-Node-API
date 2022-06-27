import { ok,forbidden } from './../../helpers/http/http-helper'
import { AccountModel } from './../../../domain/models/account'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { HttpRequest, HttpResponse, Middleware } from './../../protocols'
import { AccessDeniedError } from './../../errors'

export class AuthMiddleware implements Middleware {
 
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      const account: AccountModel|null = await this.loadAccountByToken.load(accessToken)
      if (account) return ok({ accountId: account.id })
    }

    const accessDenied: HttpResponse = forbidden(new AccessDeniedError())
    return accessDenied
  }

}