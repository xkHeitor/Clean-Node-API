import { makeAddSurveyController } from './../factories/controllers/add-survey/add-survey-controller-factory'
import { adaptRouteExpress } from '../adapters/express-route'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adaptRouteExpress(makeAddSurveyController()))
}