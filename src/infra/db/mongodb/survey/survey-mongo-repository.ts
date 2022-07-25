import { LoadSurveyByIdRepository } from '@/data/protocols/repository/survey/load-survey-by-id-repository'
import { AddSurveyRepository } from '@/data/protocols/repository/survey/add-survey-repository'
import { LoadSurveysRepository } from '@/data/protocols/repository/survey/load-surveys-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { SurveyModel } from '@/domain/models/survey'
import { MongoHelper } from './../helpers/mongo'
import { Collection, Document, ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {

  private readonly collectionName: string = 'surveys'

  async add(surveyData: AddSurveyModel): Promise<void> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection(this.collectionName)
    await surveyCollection.insertOne(surveyData)
  }
  
  async loadAll(): Promise<SurveyModel[]> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection(this.collectionName)
    const surveys = await surveyCollection.find().toArray()
    const surveyModel = MongoHelper.mapAll(surveys)
    return surveyModel
  }

  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection: Collection<Document> = await MongoHelper.getCollection(this.collectionName)
    const survey: ReturnType<any> = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey
  }

}