import { adaptRouteExpress } from '../adapters/express-route'
import { makeLoadSurveysController } from './../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { Router } from 'express'
import { adminAuth, auth } from '../middlewares/auth'

export default (router: Router): void => {  
  router.post('/surveys', adminAuth, adaptRouteExpress(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRouteExpress(makeLoadSurveysController()))
}