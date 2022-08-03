import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultParams) => Promise<SurveyResultModel>
}