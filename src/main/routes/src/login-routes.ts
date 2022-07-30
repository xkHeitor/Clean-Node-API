import { adaptRouteExpress } from '@/main/adapters/express-route'
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', adaptRouteExpress(makeSignUpController()))
  router.post('/login', adaptRouteExpress(makeLoginController()))
}