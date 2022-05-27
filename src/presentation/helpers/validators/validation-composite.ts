import { Validation } from './validation'

export class ValidationComposite implements Validation {
  
  constructor(private readonly validations: Validation[]) {}

  validate(input: any): Error|undefined {
    for (const validation of this.validations) {
      const error: Error|undefined = validation.validate(input)
      if (error) return error
    }
  }

}