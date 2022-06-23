import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount } from './../../usecases/add-account/db-add-account-factory'
import { Authentication } from './../../../../domain/usecases/authentication'
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { Controller } from '../../../../presentation/protocols/controller'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { makeSignUpValidation } from './signup-validation-factory'
import SignUpController from '../../../../presentation/controllers/login/signup/signup-controller'

export const makeSignUpController = (): Controller => {
  const validationComposite: ValidationComposite = makeSignUpValidation()
  const dbAddAccount: AddAccount = makeDbAddAccount()
  const dbAuthentication: Authentication = makeDbAuthentication()
  return makeLogControllerDecorator(new SignUpController(dbAddAccount, validationComposite, dbAuthentication))
}