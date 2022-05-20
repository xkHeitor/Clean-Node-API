import { Controller } from './../../presentation/protocols/controller'
import { makeSignUpController } from './../factories/signup'
import { adaptRouteExpress } from './../adapters/express-route'
import { Router } from 'express'

export default (router: Router): void => {
  const signUpController: Controller = makeSignUpController()
  router.post('/signup', adaptRouteExpress(signUpController))
}