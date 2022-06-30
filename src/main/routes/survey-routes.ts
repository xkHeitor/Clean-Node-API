import { adaptMiddleware } from './../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from './../factories/middlewares/auth-middleware-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { adaptRouteExpress } from '../adapters/express-route'
import { Router } from 'express'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRouteExpress(makeAddSurveyController()))
}