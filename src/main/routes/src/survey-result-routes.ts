import { adaptRouteExpress } from '@/main/adapters/express-route'
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/save-survey-result/save-survey-result-controller-factory'
import { auth } from '@/main/middlewares/auth'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRouteExpress(makeSaveSurveyResultController()))
}