import { ok, badRequest, serverError } from './../../helpers/http-helper'
import { HttpRequest } from './../../protocols/http'
import { MissingParamError, ServerError } from '../../errors'
import { Controller, HttpResponse, AccountModel, AddAccount, AddAccountModel, Validation } from './signup-protocols'
import SignUpController from './signup'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount()
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error|undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: Controller
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub: Validation = makeValidation()
  const addAccountStub: AddAccount = makeAddAccount()
  const sut: Controller = new SignUpController(addAccountStub, validationStub)
  return { sut, addAccountStub, validationStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name', 
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name', password: 'any_pass', email: 'any_email@mail.com'
    })
  })

  test('Should return 500 if AddAccount throws ', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async (): Promise<AccountModel> => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = makeFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut }: SutTypes = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub }: SutTypes = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub }: SutTypes = makeSut()
    const error = new MissingParamError('any_field')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

})