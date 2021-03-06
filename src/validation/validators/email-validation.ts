import { InvalidParamError } from '@/presentation/errors/invalid-param-error'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {

  constructor(private readonly fieldName: string, private readonly emailValidator: EmailValidator){}

  validate(input: any): Error|undefined {
    const emailIsValid: boolean = this.emailValidator.isValid(input[this.fieldName])
    if (!emailIsValid) return new InvalidParamError(this.fieldName)
  }

}