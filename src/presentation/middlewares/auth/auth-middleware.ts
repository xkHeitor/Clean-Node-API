import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { HttpRequest, HttpResponse, Middleware } from './../../protocols'
import { forbidden } from '../../helpers/http/http-helper'
import { AccessDeniedError } from './../../errors'

export class AuthMiddleware implements Middleware {
 
  constructor(private readonly loadAccountByToken: LoadAccountByToken) {}
  
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }

    const accessDenied: HttpResponse = forbidden(new AccessDeniedError())
    return accessDenied
  }

}