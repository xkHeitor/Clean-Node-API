import { EmailValidator } from './../../presentation/protocols/email-validator'
import EmailValidatorAdapter from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut: EmailValidator = new EmailValidatorAdapter();
    const isValid: boolean = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  })
})
