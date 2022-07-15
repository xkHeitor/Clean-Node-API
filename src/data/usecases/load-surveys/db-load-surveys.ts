import { SurveyModel } from './../../../domain/models/survey'
import { LoadSurveysRepository } from './../../protocols/repository/survey/load-surveys-repository'
import { LoadSurveys } from './../../../domain/usecases/load-surveys'

export class DbLoadSurveys implements LoadSurveys {

  constructor(private readonly loadSurveysRepository: LoadSurveysRepository){}  

  async load(): Promise<SurveyModel[]> {
    const surveys: SurveyModel[] = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}