import { EmailValidator } from '@/validation/protocols/email-validator'
import EmailValidatorAdapter from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {

  test('Should return false if validator returns false', () => {
    const sut: EmailValidator = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid: boolean = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut: EmailValidator = makeSut()
    const isValid: boolean = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut: EmailValidator = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const email: string = 'any_email@mail.com'
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })

})