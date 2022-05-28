import { MissingParamError } from './../../errors/missing-param-error'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return new MissingParamError('field')
    }
  }
  return new ValidationStub()
}

interface sutTypes {
  sut: ValidationComposite;
  validationStub: Validation;
}

const makeSut = (): sutTypes => {
  const validationStub: Validation = makeValidationStub()
  const sut: ValidationComposite = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

describe('Validation Composite', () => {

  test('Should return an error if any validation fails', () => {
    const { sut } = makeSut()
    const error: Error|undefined = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

})