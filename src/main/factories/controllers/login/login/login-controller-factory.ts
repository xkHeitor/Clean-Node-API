import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { makeDbAuthentication } from '../../../usecases/account/authentication/db-authentication-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { Controller } from '../../../../../presentation/protocols/controller'
import { ValidationComposite } from '../../../../../validation/validators'
import { makeLoginUpValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const validation: ValidationComposite = makeLoginUpValidation()
  const dbAuthentication: Authentication = makeDbAuthentication()
  return makeLogControllerDecorator(new LoginController(dbAuthentication, validation))
}