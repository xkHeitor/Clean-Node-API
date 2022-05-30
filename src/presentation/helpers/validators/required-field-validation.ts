import { MissingParamError } from '../../errors/missing-param-error'
import { Validation } from '../../protocols/validation'

export class RequiredFieldValidation implements Validation {
  
  constructor(private readonly fieldName: string) {}

  validate(input: any): Error|undefined {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}