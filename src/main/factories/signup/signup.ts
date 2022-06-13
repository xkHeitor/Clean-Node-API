import { AddAccountRepository } from './../../../data/protocols/repository/add-account-repository'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { LogErrorRepository } from '../../../data/protocols/repository/log-error-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from '../../decorators/log'
import { Controller } from '../../../presentation/protocols/controller'
import { Hasher } from '../../../data/protocols/criptograpy/hasher'
import { AddAccount } from '../../../domain/usecases/add-account'
import { makeSignUpValidation } from './signup-validation'
import SignUpController from '../../../presentation/controllers/signup/signup'
import DbAddAccount from '../../../data/usecases/add-account/db-add-account'
import AccountMongoRepository from '../../../infra/db/mongodb/account-repository/account'
import BcryptAdapter from '../../../infra/criptograpy/bcrypt-adapter/bcrypt-adapter'

export const makeSignUpController = (): Controller => {
  const salt: number = 12
  const bcrypt: Hasher = new BcryptAdapter(salt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()  
  const dbAccount: AddAccount = new DbAddAccount(bcrypt, addAccountRepository)
  const validationComposite: ValidationComposite = makeSignUpValidation()
  const signUpController: Controller = new SignUpController(dbAccount, validationComposite)
  const logMongoRepository: LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}