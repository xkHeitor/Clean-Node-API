import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey/save-survey-result'

export interface SaveSurveyResultRepository {
  save: (data: SaveSurveyResultModel) => Promise<SurveyResultModel>
}