import { adaptMiddleware } from './../adapters/express-middleware-adapter'
import { adaptRouteExpress } from '../adapters/express-route'
import { makeLoadSurveysController } from './../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAuthMiddleware } from './../factories/middlewares/auth-middleware-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())
  
  router.post('/surveys', adminAuth, adaptRouteExpress(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRouteExpress(makeLoadSurveysController()))
}