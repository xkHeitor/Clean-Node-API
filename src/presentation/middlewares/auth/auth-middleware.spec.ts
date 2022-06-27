import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token'
import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from './../../errors'
import { forbidden, ok } from './../../helpers/http/http-helper'
import { HttpRequest, HttpResponse, Middleware } from './../../protocols'
import { AccountModel } from '../../../domain/models/account'

describe('Auth Middleware', () => {

  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id', 
    name: 'valid_name',
    email: 'valid_email', 
    password: 'hashed_password'
  })  

  const makeFakeRequest = (): HttpRequest => ({
    headers: { 'x-access-token': 'any_token' }
  })

  const makeLoadAccountByToken = (): LoadAccountByToken => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string, role?: string | undefined): Promise<AccountModel|null> {
        return new Promise(resolve => (resolve(makeFakeAccount())))
      }
    }
    return new LoadAccountByTokenStub()
  }

  interface sutTypes {
    sut: Middleware
    loadAccountByTokenStub: LoadAccountByToken
  }

  const makeSut = (): sutTypes => {
    const loadAccountByTokenStub: LoadAccountByToken = makeLoadAccountByToken()
    const sut: Middleware = new AuthMiddleware(loadAccountByTokenStub)
    return { sut, loadAccountByTokenStub }
  }

  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest: HttpRequest = makeFakeRequest() 
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'])
  })

  test('Should return 403 if LoadAccountByToken returns call', async () => {
    const { sut,loadAccountByTokenStub } = makeSut()
    const resolvePromise: Promise<null> = new Promise(resolve => resolve(null))
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(resolvePromise)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

})