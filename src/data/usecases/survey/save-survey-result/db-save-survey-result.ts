import { SurveyResultModel, SaveSurveyResultRepository, SaveSurveyResult, SaveSurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  
  constructor(private readonly saveSurveyResultRepository: SaveSurveyResultRepository){}

  async save(data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResult: SurveyResultModel = await this.saveSurveyResultRepository.save(data)
    return surveyResult
  }
  
}