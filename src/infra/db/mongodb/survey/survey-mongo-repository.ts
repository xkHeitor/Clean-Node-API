import { AddSurveyRepository } from '@/data/protocols/repository/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/repository/survey/load-surveys-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from './../helpers/mongo'
import { Collection, Document } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository {
  
  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
  
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()
    const test = MongoHelper.mapAll(surveys)
    return test
  }

}