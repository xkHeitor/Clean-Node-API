import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { makeLoginUpValidation } from './login-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite.ts')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  
  test('Should call ValidationComposite with all validations', () => {
    makeLoginUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('email'),
      new EmailValidation('email', makeEmailValidator())
    ])
  })

})