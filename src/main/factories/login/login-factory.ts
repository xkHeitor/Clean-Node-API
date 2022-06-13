import { JwtAdapter } from './../../../infra/criptograpy/jwt-adapter/jwt-adapter'
import { DbAuthentication } from './../../../data/usecases/authentication/db-authentication'
import { LogControllerDecorator } from './../../decorators/log-controller-decorator'
import { LoginController } from './../../../presentation/controllers/login/login-controller'
import { LogMongoRepository } from './../../../infra/db/mongodb/log/log-mongo-repository'
import { Controller } from './../../../presentation/protocols/controller'
import { ValidationComposite } from '../../../presentation/helpers/validators'
import { makeLoginUpValidation } from './login-validation-factory'
import AccountMongoRepository from '../../../infra/db/mongodb/account/account-mongo-repository'
import BcryptAdapter from '../../../infra/criptograpy/bcrypt-adapter/bcrypt-adapter'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository() 
  const salt: number = 12
  const bcryptAdapter: BcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter: JwtAdapter = new JwtAdapter(env.jwtSecret)
  const dbAuthentication: DbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const validation: ValidationComposite = makeLoginUpValidation()
  const loginController: LoginController = new LoginController(dbAuthentication, validation)
  const logMongoRepository: LogMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(loginController, logMongoRepository)
}