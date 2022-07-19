import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { Authentication } from '@/domain/usecases/authentication'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { AddAccount } from '@/domain/usecases/add-account'
import { Controller } from '@/presentation/protocols/controller'
import SignUpController from '@/presentation/controllers/login/signup/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const validationComposite: ValidationComposite = makeSignUpValidation()
  const dbAddAccount: AddAccount = makeDbAddAccount()
  const dbAuthentication: Authentication = makeDbAuthentication()
  return makeLogControllerDecorator(new SignUpController(dbAddAccount, validationComposite, dbAuthentication))
}