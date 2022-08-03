import { SaveSurveyResultParams, SaveSurveyResultRepository } from '@/data/usecases/survey/save-survey-result/db-save-survey-result-protocols'
import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { MongoHelper } from '../helpers/mongo'
import { Collection } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  
  private readonly collectionName: string = 'surveyResults'

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection: Collection = await MongoHelper.getCollection(this.collectionName)
    const survey: ReturnType<any> = await surveyCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })

    return survey.value && MongoHelper.map(survey.value) 
  }

}