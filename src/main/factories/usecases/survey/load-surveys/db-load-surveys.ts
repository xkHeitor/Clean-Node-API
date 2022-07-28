import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys'

export const makeDbLoadSurvey = (): LoadSurveys => {
  const surveyMongoRepository: SurveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(surveyMongoRepository)
}