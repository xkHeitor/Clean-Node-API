import { MissingParamError } from './../../errors/missing-param-error'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs: Validation[] = [makeValidationStub(), makeValidationStub()]
  const sut: ValidationComposite = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

describe('Validation Composite', () => {

  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    const expectError: Error = new MissingParamError('field')
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(expectError)
    const error: Error|undefined = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more the one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))
    const error: Error|undefined = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new Error())
  })

})