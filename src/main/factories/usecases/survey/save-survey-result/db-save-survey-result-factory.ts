import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from '@/domain/usecases/survey/save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  const surveyResultMongoRepository: SurveyResultMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(surveyResultMongoRepository)
}