import { DbLoadAccountByToken } from './../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { LoadAccountByToken } from './../../../../domain/usecases/load-account-by-token'
import { JwtAdapter } from './../../../../infra/criptograpy/jwt-adapter/jwt-adapter'
import AccountMongoRepository from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter: JwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}