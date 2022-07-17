import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
export const auth = adaptMiddleware(makeAuthMiddleware())