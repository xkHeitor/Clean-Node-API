import { mockSurveyModel } from '@/domain/test/mock-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { SurveyResultModel } from '@/domain/models/survey/survey-result'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey/save-survey-result'
import { SurveyModel } from '@/domain/models/survey/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockSurveyResultModel, mockSurveysModel } from '@/domain/test'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyParams): Promise<void> {
      return new Promise(resolve => resolve())
    } 
  }
  return new AddSurveyStub()
}

export const mockLoadSurveysStub = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(): Promise<SurveyModel[]> {
      return new Promise(resolve => resolve(mockSurveysModel()))
    }
  }
  return new LoadSurveysStub()
}

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResultModel()))
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return new Promise(resolve => resolve(mockSurveyModel()))
    }
  }
  return new LoadSurveyByIdStub()
}