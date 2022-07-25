import { LoadSurveyByIdRepository } from '@/data/protocols/repository/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'
import { SurveyModel } from '../load-surveys/db-load-surveys-protocols'

export class DbLoadSurveyById implements LoadSurveyById {

  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository){}

  async loadById(id: string): Promise<SurveyModel> {
    const survey: SurveyModel = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
  
}