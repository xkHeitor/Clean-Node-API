import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory'
import { Authentication } from '@/domain/usecases/account/authentication'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { Controller } from '@/presentation/protocols/controller'
import { ValidationComposite } from '@/validation/validators'
import { makeLoginUpValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const validation: ValidationComposite = makeLoginUpValidation()
  const dbAuthentication: Authentication = makeDbAuthentication()
  return makeLogControllerDecorator(new LoginController(dbAuthentication, validation))
}