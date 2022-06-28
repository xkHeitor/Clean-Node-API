import { DbAuthentication } from '../../../../../data/usecases/authentication/db-authentication'
import { Authentication } from '../../../../../domain/usecases/authentication'
import { JwtAdapter } from '../../../../../infra/criptograpy/jwt-adapter/jwt-adapter'
import BcryptAdapter from '../../../../../infra/criptograpy/bcrypt-adapter/bcrypt-adapter'
import AccountMongoRepository from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository() 
  const salt: number = 12
  const bcryptAdapter: BcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter: JwtAdapter = new JwtAdapter(env.jwtSecret)
  return new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}