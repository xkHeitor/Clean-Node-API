import { MissingParamError } from '../../../errors/missing-param-error'
import { Validation } from '../../../protocols/validation'
import { Controller, HttpResponse, HttpRequest, Authentication } from './login-controller-protocols'
import { serverError, unauthorized, badRequest, ok } from '../../../helpers/http/http-helper'
import { LoginController } from './login-controller'
import { mockAuthentication } from '@/presentation/test'
import { mockValidationStub } from '@/validation/test'

type SutTypes = {
  sut: Controller;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const authenticationStub: Authentication = mockAuthentication()
  const validationStub: Validation = mockValidationStub()
  const sut: Controller = new LoginController(authenticationStub, validationStub)
  return { sut, authenticationStub, validationStub } 
}

const mockFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_pass'
  }
})

describe('Login Controller', () => {

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email',
      password: 'any_pass'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const resolvePromise: Promise<string> = new Promise(resolve => resolve(''))
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(resolvePromise)
    const httpResponse: HttpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse: HttpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 20 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpResponse: HttpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub }: SutTypes = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub }: SutTypes = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse: HttpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

})