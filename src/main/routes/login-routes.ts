import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
import { adaptRouteExpress } from '../adapters/express-route'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRouteExpress(makeSignUpController()))
  router.post('/login', adaptRouteExpress(makeLoginController()))
}