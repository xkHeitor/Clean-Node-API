import { AddAccountRepository } from './../../data/protocols/add-account-repository'
import { Encrypted } from './../../data/protocols/encrypted'
import { AddAccount } from './../../domain/usecases/add-account'
import { EmailValidator } from './../../presentation/protocols/email-validator'
import SignUpController from '../../presentation/controllers/signup/signup'
import EmailValidatorAdapter from '../../utils/email-validator/email-validator-adapter'
import DbAddAccount from '../../data/usecases/add-account/db-add-account'
import BcryptAdapter from '../../infra/criptograpy/bcrypt-adater'
import AccountMongoRepository from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const salt: number = 12
  const bcrypt: Encrypted = new BcryptAdapter(salt)
  const addAccountRepository: AddAccountRepository = new AccountMongoRepository()  
  const dbAccount: AddAccount = new DbAddAccount(bcrypt, addAccountRepository)
  const emailValidator: EmailValidator = new EmailValidatorAdapter()
  return new SignUpController(emailValidator, dbAccount)
}