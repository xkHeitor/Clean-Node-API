import { ok, badRequest, serverError, forbidden } from '../../../helpers/http/http-helper'
import { HttpRequest } from '../../../protocols/http'
import { EmailInUseError, MissingParamError, ServerError } from '../../../errors'
import SignUpController from './signup-controller'
import { 
  Controller, 
  HttpResponse, 
  AccountModel, 
  AddAccount,
  Validation,
  Authentication
} from './signup-controller-protocols'
import { mockAddAccount, mockValidation, mockAuthentication } from '@/presentation/test'

type SutTypes = {
  sut: Controller
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const validationStub: Validation = mockValidation()
  const addAccountStub: AddAccount = mockAddAccount()
  const authenticationStub: Authentication = mockAuthentication()
  const sut: Controller = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

const mockFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

describe('SignUp Controller', () => {

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub }: SutTypes = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = mockFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name', password: 'any_pass', email: 'any_email@mail.com'
    })
  })

  test('Should return 500 if AddAccount throws ', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async (): Promise<AccountModel> => {
      return Promise.reject(new Error())
    })
    const httpRequest = mockFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut }: SutTypes = makeSut()
    const httpRequest = mockFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub }: SutTypes = makeSut()
    const nullPromise: Promise<null> = Promise.resolve(null)
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(nullPromise)
    const httpRequest = mockFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
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

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse: HttpResponse = await sut.handle(mockFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

})