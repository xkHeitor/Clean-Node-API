import { ValidationComposite } from './../../presentation/helpers/validators/validation-composite'
import { LogErrorRepository } from './../../data/protocols/log-error-repository'
import { LogMongoRepository } from './../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from './../decorators/log'
import { Controller } from './../../presentation/protocols/controller'
import { AddAccountRepository } from './../../data/protocols/add-account-repository'
import { Encrypted } from './../../data/protocols/encrypted'
import { AddAccount } from './../../domain/usecases/add-account'
import { makeSignUpValidation } from './signup-validation'
import SignUpController from '../../presentation/controllers/signup/signup'
import DbAddAccount from '../../data/usecases/add-account/db-add-account'
import BcryptAdapter from '../../infra/criptograpy/bcrypt-adater'
import AccountMongoRepository from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): Controller => {
  const salt: number = 12
  const bcrypt: Encrypted = new BcryptAdapter(salt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()  
  const dbAccount: AddAccount = new DbAddAccount(bcrypt, addAccountRepository)
  const validationComposite: ValidationComposite = makeSignUpValidation()
  const signUpController: Controller = new SignUpController(dbAccount, validationComposite)
  const logMongoRepository: LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}