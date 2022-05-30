import { InvalidParamError } from './../../errors/invalid-param-error'
import { Validation } from '../../protocols/validation'

export class CompareFieldsValidation implements Validation {
  
  constructor(private readonly fieldName: any, private readonly fieldToCompareName: any){}

  validate(input: any): Error|undefined {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) return new InvalidParamError(this.fieldToCompareName)
  }

}