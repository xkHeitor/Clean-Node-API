import { AddAccount } from './../../../../domain/usecases/add-account'
import BcryptAdapter from '../../../../infra/criptograpy/bcrypt-adapter/bcrypt-adapter'
import AccountMongoRepository from '../../../../infra/db/mongodb/account/account-mongo-repository'
import DbAddAccount from '../../../../data/usecases/add-account/db-add-account'

export const makeDbAddAccount = (): AddAccount => {
  const salt: number = 12
  const bcryptAdapter: BcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository()
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, accountMongoRepository)

}