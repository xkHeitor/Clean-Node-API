import { LogErrorRepository } from './../../data/protocols/log-error-repository'
import { LogMongoRepository } from './../../infra/db/mongodb/log-repository/log'
import { LogControllerDecorator } from './../decorators/log'
import { Controller } from './../../presentation/protocols/controller'
import { AddAccountRepository } from './../../data/protocols/add-account-repository'
import { Encrypted } from './../../data/protocols/encrypted'
import { AddAccount } from './../../domain/usecases/add-account'
import { EmailValidator } from './../../presentation/protocols/email-validator'
import SignUpController from '../../presentation/controllers/signup/signup'
import EmailValidatorAdapter from '../../utils/email-validator/email-validator-adapter'
import DbAddAccount from '../../data/usecases/add-account/db-add-account'
import BcryptAdapter from '../../infra/criptograpy/bcrypt-adater'
import AccountMongoRepository from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): Controller => {
  const salt: number = 12
  const bcrypt: Encrypted = new BcryptAdapter(salt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()  
  const dbAccount: AddAccount = new DbAddAccount(bcrypt, addAccountRepository)
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  const signUpController: Controller = new SignUpController(emailValidator, dbAccount)
  const logMongoRepository: LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signUpController, logMongoRepository)
}