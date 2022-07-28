import { LoadSurveyById, LoadSurveyByIdRepository, SurveyModel } from './load-survey-by-id-protocols'

export class DbLoadSurveyById implements LoadSurveyById {

  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

  async loadById(id: string): Promise<SurveyModel> {
    const survey: SurveyModel = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
  
}