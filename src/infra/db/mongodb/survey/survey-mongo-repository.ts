import { Collection, Document } from 'mongodb'
import { MongoHelper } from './../helpers/mongo'
import { AddSurveyModel } from '../../../../domain/usecases/add-survey'
import { AddSurveyRepository } from './../../../../data/protocols/repository/survey/add-survey-repository'

export class SurveyMongoRepository implements AddSurveyRepository{
  
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

}