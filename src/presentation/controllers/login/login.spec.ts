import { serverError } from './../../helpers/http-helper'
import { InvalidParamError } from './../../errors/invalid-param-error'
import { EmailValidator } from './../../protocols/email-validator'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { HttpResponse, HttpRequest } from './../../protocols'
import { LoginController } from './login'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub: EmailValidator = makeEmailValidator()
  const sut: LoginController = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub } 
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_pass'
  }
})

describe('Login Controller', () => {

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse: HttpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse: HttpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

})