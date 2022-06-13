import { makeLoginController } from './../factories/login/login-factory'
import { makeSignUpController } from '../factories/signup/signup-factory'
import { adaptRouteExpress } from '../adapters/express-route'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRouteExpress(makeSignUpController()))
  router.post('/login', adaptRouteExpress(makeLoginController()))
}