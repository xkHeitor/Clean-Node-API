import { Middleware } from './../../../presentation/protocols/middleware'
import { makeDbLoadAccountByToken } from './../usecases/load-account-by-token/db-load-account-by-token-factory'
import { AuthMiddleware } from '../../../presentation/middlewares/auth/auth-middleware'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role)
}