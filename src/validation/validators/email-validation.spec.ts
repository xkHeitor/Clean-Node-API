import { EmailValidation } from './email-validation'
import { mockEmailValidator } from '../test'
import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { EmailValidator } from '@/validation/protocols/email-validator'

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub: EmailValidator = mockEmailValidator()
  const sut: EmailValidation = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub }: SutTypes = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((): boolean => {
      throw new Error()
    })  
    expect(sut.validate).toThrow()
  })

  test('Should throw if EmailValidator is invalid', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation((): boolean => { return false })
    const params = { email: 'test@example.com' }
    expect(sut.validate(params)).toEqual(new InvalidParamError('email'))
  })

})