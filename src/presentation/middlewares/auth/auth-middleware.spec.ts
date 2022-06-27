import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from './../../errors'
import { forbidden } from './../../helpers/http/http-helper'
import { HttpResponse, Middleware } from './../../protocols'

describe('Auth Middleware', () => {

  interface sutTypes {
    sut: Middleware
  }

  const makeSut = (): sutTypes => {
    const sut: Middleware = new AuthMiddleware()
    return { sut }
  }

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

})