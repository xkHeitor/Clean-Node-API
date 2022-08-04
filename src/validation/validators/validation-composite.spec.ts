import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from './validation-composite'
import { mockValidationStub } from '../test/mock-validation'

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeSut = (): SutTypes => {
  const validationStubs: Validation[] = [mockValidationStub(), mockValidationStub()]
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

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error: Error|undefined = sut.validate({ field: 'any_value' })
    expect(error).toBeFalsy()
  })

})