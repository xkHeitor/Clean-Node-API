import { LoadSurveys } from './../../../../../domain/usecases/load-surveys'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveys } from '../../../../../data/usecases/load-surveys/db-load-surveys'

export const makeDbLoadSurvey = (): LoadSurveys => {
  const surveyMongoRepository: SurveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}