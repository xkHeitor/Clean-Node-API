import { LoadAccountByToken, HttpRequest, HttpResponse, Middleware } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from './../../errors'
import { forbidden, ok, serverError } from './../../helpers/http/http-helper'
import { throwError } from '@/domain/test'
import { mockLoadAccountByToken } from '@/presentation/test'

describe('Auth Middleware', () => {

  const makeFakeRequest = (): HttpRequest => ({
    headers: { 'x-access-token': 'any_token' }
  })

  type SutTypes = {
    sut: Middleware
    loadAccountByTokenStub: LoadAccountByToken
  }

  const makeSut = (role?: string): SutTypes => {
    const loadAccountByTokenStub: LoadAccountByToken = mockLoadAccountByToken()
    const sut: Middleware = new AuthMiddleware(loadAccountByTokenStub, role)
    return { sut, loadAccountByTokenStub }
  }

  test('Should return 403 if no headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({ headers: undefined })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 403 if is no value in x-access-token', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({ headers: { 'x-access-token': undefined } })
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'any_id' }))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const role: string = 'any_role'
    const { sut,loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest() 
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should return 403 if LoadAccountByToken returns call', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    const resolvePromise: Promise<null> = Promise.resolve(null)
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(resolvePromise)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

})