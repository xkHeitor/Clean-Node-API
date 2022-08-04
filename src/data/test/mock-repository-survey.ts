import { SaveSurveyResultParams } from '@/domain/usecases/survey/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { SaveSurveyResultRepository } from '@/data/usecases/survey/save-survey-result/db-save-survey-result-protocols'
import { LoadSurveysRepository } from '@/data/protocols/repository/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey/survey'
import { LoadSurveyByIdRepository } from '@/data/protocols/repository/survey/load-survey-by-id-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { AddSurveyRepository } from '@/data/protocols/repository/survey/add-survey-repository'
import { mockSurveyModel, mockSurveyResultModel, mockSurveysModel as mockSurveyModels } from '@/domain/test/mock-survey'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (surveyData: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveyModels()))
    }
  }
  return new LoadSurveysRepositoryStub()
}

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}