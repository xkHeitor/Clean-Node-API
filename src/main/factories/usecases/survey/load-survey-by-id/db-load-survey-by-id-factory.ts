
import { DbLoadSurveyById } from '@/data/usecases/survey/load-survey-by-id/load-survey-by-id'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository: SurveyMongoRepository = new SurveyMongoRepository()
  return new DbLoadSurveyById(surveyMongoRepository)
}