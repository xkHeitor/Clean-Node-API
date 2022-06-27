import { ok,forbidden, serverError } from './../../helpers/http/http-helper'
import { AccountModel } from './../../../domain/models/account'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { HttpRequest, HttpResponse, Middleware } from './../../protocols'
import { AccessDeniedError } from './../../errors'

export class AuthMiddleware implements Middleware {
 
  constructor(private readonly loadAccountByToken: LoadAccountByToken, private readonly role?: string) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      try {
        const account: AccountModel|null = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) return ok({ accountId: account.id })
      } catch (error: any) {
        return serverError(error) 
      }
    }
    const accessDenied: HttpResponse = forbidden(new AccessDeniedError())
    return accessDenied
  }

}