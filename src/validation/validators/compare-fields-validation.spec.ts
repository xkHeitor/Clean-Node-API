import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { Validation } from '@/presentation/protocols/validation'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): Validation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Compare Fields Validation', () => {

  test('Should return a MissingParamError if validation fails', () => {
    const sut: Validation = makeSut()
    const error: Error|undefined = sut.validate({ 
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut: Validation = makeSut()
    const error: Error|undefined = sut.validate({ 
      field: 'any_value',
      fieldToCompare: 'any_value'
    })
    expect(error).toBeFalsy()
  })

})