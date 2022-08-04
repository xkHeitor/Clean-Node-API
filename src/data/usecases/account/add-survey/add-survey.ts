import { AddSurvey, AddSurveyParams, AddSurveyRepository } from './add-survey-protocols'

export class DbAddSurvey implements AddSurvey {

  constructor (private readonly addSurveyRepository: AddSurveyRepository){}
  
  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data)
  }

}