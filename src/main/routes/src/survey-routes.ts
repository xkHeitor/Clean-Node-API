
import { adminAuth, auth } from '@/main/middlewares/auth'
import { adaptRouteExpress } from '@/main/adapters/express-route'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveysController } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { Router } from 'express'

export default (router: Router): void => {  
  router.post('/surveys', adminAuth, adaptRouteExpress(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRouteExpress(makeLoadSurveysController()))
}