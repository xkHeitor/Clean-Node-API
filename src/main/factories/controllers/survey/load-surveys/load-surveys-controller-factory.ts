import { LoadSurveysController } from './../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeDbLoadSurvey } from './../../../usecases/survey/load-surveys/db-load-surveys'
import { makeLogControllerDecorator } from './../../../decorators/log-controller-decorator-factory'
import { Controller } from '../../../../../presentation/protocols'

export const makeLoadSurveysController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurvey())
  return makeLogControllerDecorator(controller)
}