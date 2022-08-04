import { Validation } from '@/presentation/protocols'

export const mockValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}