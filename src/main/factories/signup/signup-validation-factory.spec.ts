import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite.ts')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })

})